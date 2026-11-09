### Link to website:
https://splendorous-gaufre-77e1d1.netlify.app

## Running it on your computer

### What you need
- [Node.js](https://nodejs.org) version 22 or newer (check with `node -v`)
- [Git](https://git-scm.com)

### Steps

1. Fork this repo on GitHub (button at the top right), then download your copy:

   ```bash
   git clone https://github.com/<your-username>/Movie-Theater-430.git
   cd Movie-Theater-430
   ```

2. Install the packages the project uses (React, Vite, Supabase):

   ```bash
   npm install
   ```

3. Start the site:

   ```bash
   npm run dev
   ```

4. Open the address it prints, usually http://localhost:5173

Press `Ctrl + C` in the terminal to stop it.

### Other commands

| Command | What it does |
| --- | --- |
| `npm run dev` | Runs the site locally and reloads when you save a file |
| `npm run build` | Makes the finished site in the `dist` folder (what Netlify hosts) |
| `npm run preview` | Opens the built `dist` version to check it before deploying |

### Database
The site reads movies, showtimes and seats from our Supabase project
(connection settings are in `src/supabaseClient.jsx`). Accounts and seat
bookings you make while testing are saved to that shared database.


### Movie-Theater-430
website right now:
<img width="1906" height="1022" alt="image" src="https://github.com/user-attachments/assets/6fb9a40c-aac3-4714-9643-a228adaf94ca" />
<img width="1892" height="1023" alt="image" src="https://github.com/user-attachments/assets/d7daada1-4a45-4941-afc7-11dd29e3c513" />
<img width="1877" height="982" alt="image" src="https://github.com/user-attachments/assets/96a116fb-dafe-47e3-b0ca-5a8e6820f7f3" />
<img width="1917" height="962" alt="image" src="https://github.com/user-attachments/assets/bb798fe9-5445-4ff8-85ba-8172293027a1" />

to do (can add more):
Make website layout [X]
Make movie cards [x]
Make Showtimes [x]
add Seat Selection [x]
Display booking summary [x]
Calculate total ticket price [x]
