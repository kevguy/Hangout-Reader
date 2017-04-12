# Hangouts Reader
While Google does allow you to backup your message history on Hangout, the backup file (Hangouts.json) is close to impossible for anyone to read, Hangouts Reader parses it and makes everything more presentable so you can still your message history anytime offline.

Note: Hangout Reader only reads the file you upload and makes its content inside more presentable. It doesn't violate your privacy as nothing is uploaded or saved in any external server.


[Try it here!](https://kevguy.github.io/Hangout-Reader/)


- [Features](https://github.com/kevguy/Hangout-Reader#features)
- [How To Use](https://github.com/kevguy/Hangout-Reader#how-to-use)
- [Can I use it locally](https://github.com/kevguy/Hangout-Reader#can-i-use-it-locally)
  - [Method 1](https://github.com/kevguy/Hangout-Reader#method-1)
  - [Method 2](https://github.com/kevguy/Hangout-Reader#method-2-recommended)

## Features
- You can
- Offers a table mode if you want to view message history in a neat and tidy way, convenient for
- Different settings


## How to use
* Visit [Google Takeout](https://takeout.google.com/settings/takeout) then click "Select none" and only check the box next to Hangouts.
* Within a few minutes or so you will recieve a zip file with Hangouts.json inside it.
* Extract the file and choose it above.  if you have a very large chat history it can take a few minutes to load the file.

## Can I use it locally?
Yes, but you may experience issues getting the profile images of everyone because CORS request failure. Overall, the behavior is 90% the same.

### Method 1
If you open `index.html` directly, Chrome and Firefox 1 will lead to a [security error](http://stackoverflow.com/questions/37718656/why-does-not-chrome-allow-web-workers-to-be-run-in-javascript) because Hangout Reader has a web worker.

If you don't want to follow along the long instructions below in method 2, you can directly open the `index.html` in the folder `offline_version` instead, it has far few features and can be very slow, but it spares you the trouble of installing this and that, stuff that only computer nerd enjoys.

### Method 2 (Recommended)
* Make sure you have [npm](https://nodejs.org/en/download/) installed on your computer.

* Make sure you have webpack and webpack-dev-server installed globally (I'm still using Webpack 1). If not, run these commands on terminal(Linux/Mac) or command prompt (Windows).

```
npm install -g webpack@^1.12.9

npm install -g webpack-dev-server@^1.4.7
```

* Download this repo either with this [link](https://github.com/kevguy/Hangout-Reader/archive/master.zip) or `git clone`.

```
git clone https://github.com/kevguy/Hangout-Reader

```

* Inside the project folder, run this command to install everything Hangout Reader needs:

```
npm install
```

* Run the command `webpack-dev-server`
