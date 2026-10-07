-- Refocus the site on ZeroD Farm.
--
-- The homepage renders the SiteContent row, not the defaults in
-- src/lib/site-data.ts, so changing the defaults alone would leave the live site
-- showing the old developer positioning. This rewrites only the positioning
-- fields (and the name, from all-caps to proper case to suit the new type);
-- images, social links and the contact email are left as stored.
-- The projects and skills features were removed, so their keys are dropped.
UPDATE "SiteContent"
SET
    "data" = jsonb_set(
        ("data" - 'projects' - 'skills') || jsonb_build_object(
            'name', 'Afif Zilani',
            'title', 'Co-Founder & CEO, ZeroD Farm',
            'tagline', 'I run ZeroD Farm, a poultry farm in Naogaon, Bangladesh. My work is healthy flocks, disciplined day-to-day operations, and growing the farm into a business people can rely on.',
            'bio', jsonb_build_array(
                'I''m Kazi Afif Zilani, an entrepreneur from Naogaon, Bangladesh. In 2022 I co-founded ZeroD Farm, and running it is now my full-time focus.',
                'Day to day that means flock health and biosecurity, feed and supply management, coordinating the people who work on the farm, and planning how the business grows from here.',
                'If you buy poultry, supply feed or equipment, or want to partner with a farm that takes its operations seriously, I''d like to hear from you.'
            ),
            'experiences', jsonb_build_array(
                jsonb_build_object(
                    'id', '1',
                    'company', 'ZeroD Farm',
                    'role', 'Co-Founder & CEO',
                    'period', '2022 — Present',
                    'description', 'Co-founded and run ZeroD Farm, a poultry farm in Naogaon. Responsible for flock health and biosecurity, daily operations, workforce, feed and supply management, and the farm''s growth plan.'
                )
            ),
            'stats', jsonb_build_array(
                jsonb_build_object('key', 'founded', 'value', '2022', 'label', 'ZeroD Farm founded'),
                jsonb_build_object('key', 'location', 'value', 'Naogaon', 'label', 'Rajshahi Division, Bangladesh'),
                jsonb_build_object('key', 'focus', 'value', 'Poultry', 'label', 'full-time, one business')
            )
        ),
        '{contact,heading}',
        '"Work with ZeroD Farm"'::jsonb,
        true
    ),
    "updatedAt" = CURRENT_TIMESTAMP
WHERE "id" = 'singleton';
