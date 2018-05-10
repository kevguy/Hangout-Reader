# ClubSIM Inbox

The ClubSIM Inbox API built with Vue 2.0 + vue-router + vuex, with server-side rendering.

## Features

- Server Side Rendering
  - Vue + vue-router + vuex working together
  - Server-side data pre-fetching
  - Client-side state & DOM hydration
  - Automatically inlines CSS used by rendered components only
  - Preload / prefetch resource hints
  - Route-level code splitting
- Progressive Web App
  - App manifest
  - Service worker
  - 100/100 Lighthouse score
- Single-file Vue Components
  - Hot-reload in development
  - CSS extraction for production
- Animation
  - Effects when switching route views
  - Real-time list updates with FLIP Animation

## Architecture Overview

<img width="973" alt="screen shot 2016-08-11 at 6 06 57 pm" src="https://cloud.githubusercontent.com/assets/499550/17607895/786a415a-5fee-11e6-9c11-45a2cfdf085c.png">


## Build Setup

**Requires Node.js 7+**

``` bash
# install dependencies
npm install # or yarn

# serve in dev mode, with hot reload at localhost:8080
npm run dev

# build for production
npm run build

# serve in production mode
npm start
```

## API References

**Query All Messages For an User:**

```
GET: /api/users/:CLUB_ID
```

**With lang preferences:**
```
Available Options: EN-US, ZH-HK

GET: /api/users/:LANG/:CLUB_ID
```

**Delete A Messge for an User:**
```
POST /api/users/delete

Headers:
'Accept': 'application/json',
'Content-Type': 'application/json'

Body:
{
  clubId: :CLUB_ID,
  messageId: :MESSAGE_ID
}
```
