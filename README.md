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

## Optional
 - Uses Redux
 - Documentation


## Setup

### Install dependencies

```bash
yarn
```

### Run the app

```bash
yarn ios
```

OR 

```bash
yarn android
```

## Trade offs

### Overfetching

Ideally the next-races-category-group API would only return races meeting the criteria (started less than 1 minute ago). Because of this we have to overfetch and filter the results on the client side. There's a remote possibility that there are more than 5 races that are returned outside the criteria and we would not have 5 races to show!

The count parameter also selects 10 races from each category, so because we have to sort through the start times on the client side, if all categories are selected we've got 25 races that we don't need.

### Re-rendering

The timer runs on the whole page causing it to re-render every second. The other option would be to run the timer on each row. Decided that re-rendering the whole page with one timer was the better option than re-rendering each row with multiple timers.

### State management

Opted not to use Redux as there's no global state required. Local state was sufficient for the category toggle.

React-query meets all the requirements for calling the API and returning the data in the correct format, as well as easy caching and re-fetching.