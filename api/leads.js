/**
 * /api/leads — Lead Capture Endpoint
 *
 * Handles form submissions from:
 * - /playbook (MOFU — Seller's Playbook download)
 * - /home-value (BOFU — Home Valuation request)
 *
 * Flow:
 * 1. Validate required fields
 * 2. Insert/upsert contact into Supabase CRM
 * 3. Log activity (form submission)
 * 4. Create task for Rusty (if BOFU)
 * 5. Trigger Mailgun welcome email
 * 6. Trigger Twilio SMS (if phone provided)
 * 7. Notify Rusty via Discord webhook (if BOFU)
 *
 * Environment Variables (set in Vercel):
 * - SUPABASE_URL
 * - SUPABASE_SERVICE_ROLE_KEY
 * - MAILGUN_API_KEY
 * - MAILGUN_DOMAIN
 * - TWILIO_ACCOUNT_SID
 * - TWILIO_AUTH_TOKEN
 * - TWILIO_PHONE_NUMBER
 */

export default async function handler(req, res) {
  // Only accept POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', 'https://rauhomegroup.com');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    const {
      first_name,
      email,
      phone,
      property_address,
      source,        // "seller-playbook" or "home-valuation"
      funnel_stage,  // "lead" or "bofu-lead"
      utm_source,
      utm_medium,
      utm_campaign,
      utm_content,
    } = req.body;

    // ── Validate required fields ──
    if (!first_name || !email) {
      return res.status(400).json({ error: 'Name and email are required.' });
    }

    if (!email.includes('@') || !email.includes('.')) {
      return res.status(400).json({ error: 'Please enter a valid email address.' });
    }

    // BOFU requires phone + address
    if (source === 'home-valuation') {
      if (!phone || !property_address) {
        return res.status(400).json({ error: 'Phone and property address are required for home valuations.' });
      }
    }

    // ── Supabase: Upsert Contact ──
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !supabaseKey) {
      console.error('Missing Supabase environment variables');
      return res.status(500).json({ error: 'Server configuration error.' });
    }

    // Map source to CRM fields
    const contactSource = source === 'home-valuation' ? 'website' : 'website';
    const contactStatus = source === 'home-valuation' ? 'new_lead' : 'new_lead';
    const contactCategory = source === 'home-valuation' ? 'hot' : 'nurturing';

    // Check if contact already exists (by email)
    const existingRes = await fetch(
      `${supabaseUrl}/rest/v1/contacts?email=eq.${encodeURIComponent(email)}&select=id,first_name,email,phone`,
      {
        headers: {
          'apikey': supabaseKey,
          'Authorization': `Bearer ${supabaseKey}`,
        },
      }
    );

    const existing = await existingRes.json();
    let contactId;

    if (existing && existing.length > 0) {
      // Update existing contact — upgrade their status if BOFU
      contactId = existing[0].id;
      const updateData = {
        source: contactSource,
        category: contactCategory,
        status: contactStatus,
        updated_at: new Date().toISOString(),
      };

      // Only update phone if they didn't have one and now provided it
      if (phone && !existing[0].phone) {
        updateData.phone = phone;
      }

      // Add property address to notes if BOFU
      if (property_address) {
        updateData.notes = `Property Address: ${property_address}\n(from ${source} form, ${new Date().toISOString()})`;
      }

      // Add UTM data to tags
      if (utm_campaign) {
        updateData.tags = [utm_campaign, source];
      }

      await fetch(
        `${supabaseUrl}/rest/v1/contacts?id=eq.${contactId}`,
        {
          method: 'PATCH',
          headers: {
            'apikey': supabaseKey,
            'Authorization': `Bearer ${supabaseKey}`,
            'Content-Type': 'application/json',
            'Prefer': 'return=minimal',
          },
          body: JSON.stringify(updateData),
        }
      );
    } else {
      // Create new contact
      const newContact = {
        first_name: first_name.trim(),
        email: email.trim().toLowerCase(),
        phone: phone ? phone.trim() : null,
        source: contactSource,
        category: contactCategory,
        status: contactStatus,
        tags: [source, utm_campaign].filter(Boolean),
        notes: property_address
          ? `Property Address: ${property_address}\n(from ${source} form, ${new Date().toISOString()})`
          : `(from ${source} form, ${new Date().toISOString()})`,
      };

      const insertRes = await fetch(
        `${supabaseUrl}/rest/v1/contacts`,
        {
          method: 'POST',
          headers: {
            'apikey': supabaseKey,
            'Authorization': `Bearer ${supabaseKey}`,
            'Content-Type': 'application/json',
            'Prefer': 'return=representation',
          },
          body: JSON.stringify(newContact),
        }
      );

      const insertData = await insertRes.json();
      contactId = insertData[0]?.id;
    }

    // ── Log Activity ──
    if (contactId) {
      const activityData = {
        contact_id: contactId,
        type: 'note',
        direction: 'inbound',
        subject: source === 'home-valuation'
          ? 'Requested Home Valuation'
          : 'Downloaded Seller\'s Playbook',
        body: source === 'home-valuation'
          ? `${first_name} requested a home valuation for: ${property_address}. UTM: ${utm_source || 'direct'}/${utm_medium || 'none'}/${utm_campaign || 'none'}/${utm_content || 'none'}`
          : `${first_name} downloaded the San Diego Seller's Playbook. UTM: ${utm_source || 'direct'}/${utm_medium || 'none'}/${utm_campaign || 'none'}/${utm_content || 'none'}`,
        metadata: {
          source,
          funnel_stage,
          utm_source,
          utm_medium,
          utm_campaign,
          utm_content,
          property_address: property_address || null,
          submitted_at: new Date().toISOString(),
        },
      };

      await fetch(`${supabaseUrl}/rest/v1/activities`, {
        method: 'POST',
        headers: {
          'apikey': supabaseKey,
          'Authorization': `Bearer ${supabaseKey}`,
          'Content-Type': 'application/json',
          'Prefer': 'return=minimal',
        },
        body: JSON.stringify(activityData),
      });
    }

    // ── Create Task for Rusty (BOFU only — call within 5 min) ──
    if (source === 'home-valuation' && contactId) {
      const taskData = {
        title: `CALL NOW: ${first_name} requested home valuation — ${property_address}`,
        type: 'call',
        priority: 'urgent',
        contact_id: contactId,
        due_date: new Date(Date.now() + 5 * 60 * 1000).toISOString(), // 5 minutes from now
      };

      await fetch(`${supabaseUrl}/rest/v1/tasks`, {
        method: 'POST',
        headers: {
          'apikey': supabaseKey,
          'Authorization': `Bearer ${supabaseKey}`,
          'Content-Type': 'application/json',
          'Prefer': 'return=minimal',
        },
        body: JSON.stringify(taskData),
      });
    }

    // ── Fire-and-forget: Email + SMS + Discord notification ──
    // These run in background — don't await them (speed up response)
    const backgroundTasks = [];

    // Trigger welcome email via Mailgun
    if (process.env.MAILGUN_API_KEY && process.env.MAILGUN_DOMAIN) {
      const mailgunDomain = process.env.MAILGUN_DOMAIN;
      const mailgunKey = process.env.MAILGUN_API_KEY;

      const emailSubject = source === 'home-valuation'
        ? `${first_name}, your home valuation is on the way`
        : `Your Seller's Playbook is here, ${first_name}`;

      const emailBody = source === 'home-valuation'
        ? `Hey ${first_name},\n\nThanks for requesting a home valuation for ${property_address}. I'm pulling the latest comps and market data for your area right now.\n\nExpect your personalized CMA within 24 hours. I'll call you to walk through the numbers — no pressure, just honest information.\n\nIn the meantime, if you have any questions, just reply to this email or text me at (858) 204-4692.\n\nTalk soon,\nRusty Rau\nRau Home Group\n(858) 204-4692\nDRE #02084462`
        : `Hey ${first_name},\n\nHere's your copy of The San Diego Seller's Playbook.\n\nInside you'll find:\n- The pricing strategy that's working in 2026\n- What inspections really look for (and the $400 fix that saves deals)\n- The true cost of selling — broken down so nothing surprises you\n- 5 mistakes I see SD sellers make every month\n\nI'll follow up in a couple days to see if anything stood out or if you have questions about your specific situation.\n\nNo rush, no pressure — just here if you need anything.\n\nRusty Rau\nRau Home Group\n(858) 204-4692\nDRE #02084462`;

      const formData = new URLSearchParams();
      formData.append('from', `Rusty Rau <rusty@${mailgunDomain}>`);
      formData.append('to', `${first_name} <${email}>`);
      formData.append('subject', emailSubject);
      formData.append('text', emailBody);
      formData.append('o:tag', source);
      formData.append('o:tag', funnel_stage || 'lead');
      if (utm_campaign) formData.append('o:tag', utm_campaign);

      backgroundTasks.push(
        fetch(`https://api.mailgun.net/v3/${mailgunDomain}/messages`, {
          method: 'POST',
          headers: {
            'Authorization': 'Basic ' + Buffer.from(`api:${mailgunKey}`).toString('base64'),
          },
          body: formData,
        }).catch(err => console.error('Mailgun error:', err.message))
      );
    }

    // Trigger SMS via Twilio (if phone provided)
    if (phone && process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN) {
      const twilioSid = process.env.TWILIO_ACCOUNT_SID;
      const twilioAuth = process.env.TWILIO_AUTH_TOKEN;
      const twilioFrom = `+1${process.env.TWILIO_PHONE_NUMBER}`;

      // Format phone number
      let toPhone = phone.replace(/\D/g, '');
      if (toPhone.length === 10) toPhone = `+1${toPhone}`;
      else if (toPhone.length === 11 && toPhone.startsWith('1')) toPhone = `+${toPhone}`;
      else toPhone = `+${toPhone}`;

      const smsBody = source === 'home-valuation'
        ? `Hey ${first_name}, it's Rusty Rau! Got your home valuation request for ${property_address}. I'm pulling the comps now — I'll have your personalized CMA ready within 24 hours. Any questions in the meantime, just text me back 👍`
        : `Hey ${first_name}, it's Rusty Rau! Just sent your Seller's Playbook to your inbox — check for an email from rusty@rauhomegroup.com. Let me know if you have any questions about the SD market, happy to help 👍`;

      const twilioData = new URLSearchParams();
      twilioData.append('To', toPhone);
      twilioData.append('From', twilioFrom);
      twilioData.append('Body', smsBody);

      backgroundTasks.push(
        fetch(`https://api.twilio.com/2010-04-01/Accounts/${twilioSid}/Messages.json`, {
          method: 'POST',
          headers: {
            'Authorization': 'Basic ' + Buffer.from(`${twilioSid}:${twilioAuth}`).toString('base64'),
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: twilioData,
        }).catch(err => console.error('Twilio error:', err.message))
      );
    }

    // Discord notification for BOFU leads (Rusty sees it immediately)
    if (source === 'home-valuation' && process.env.DISCORD_WEBHOOK_URL) {
      backgroundTasks.push(
        fetch(process.env.DISCORD_WEBHOOK_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            content: `🔥 **NEW HOME VALUATION REQUEST** 🔥\n**Name:** ${first_name}\n**Email:** ${email}\n**Phone:** ${phone}\n**Address:** ${property_address}\n**Source:** ${utm_source || 'direct'} / ${utm_campaign || 'none'}\n\n⚡ **CALL NOW — within 5 minutes!**`,
          }),
        }).catch(err => console.error('Discord error:', err.message))
      );
    }

    // Fire background tasks (don't wait for them)
    if (backgroundTasks.length > 0) {
      Promise.allSettled(backgroundTasks).then(results => {
        results.forEach((result, i) => {
          if (result.status === 'rejected') {
            console.error(`Background task ${i} failed:`, result.reason);
          }
        });
      });
    }

    // ── Return success immediately ──
    return res.status(200).json({
      success: true,
      first_name: first_name.trim(),
      source,
    });

  } catch (error) {
    console.error('Lead capture error:', error);
    return res.status(500).json({ error: 'Something went wrong. Please try again.' });
  }
}
