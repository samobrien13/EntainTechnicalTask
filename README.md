## Task

Create a single page application that displays 'Next to go’ races using our API.

A user should see 5 races at all times, and they should be sorted by time ascending. Race should disappear from the list after 1 min past the start time (advertised_start).

User should see meeting name (meeting_name), race number (race_number) and countdown timer that indicates the start of the race.

User should be able to toggle race categories to view races belonging to only the selected category. Categories are defined by IDs and are the following:

Greyhound racing: category_id: '9daef0d7-bf3c-4f50-921d-8e818c60fe61'

Harness racing: category_id: '161d9be2-e909-4326-8c2c-35ed71fb460b'

Horse racing: category_id: '4a2788f8-e825-4d36-9894-efd4baf1cfae'

## Requirements

 - Uses React Native and the bare workflow (not Expo)
 - Uses Neds API to fetch a list of races
 - Uses Typescript
 - Has some level of testing. Full coverage isn't necessary, but there should be at least some testing for key files.