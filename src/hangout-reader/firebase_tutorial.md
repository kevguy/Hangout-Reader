# Firebase Guide
(last updated by: Kev Lai, Jan 29, 2017)

## Login
### Step 1: Home Page
Go to the console through this link: https://firebase.google.com/

<p align="center">
  <img src="images/firebase_home.png" height="300" />
</p>
<p align="center">Home Page</p>

### Step 2: Sign In
Click the  `Sign In` button at the top right corner and input the following credentials:

- username: clubsim.hk@gmail.com
- password: Ab20120130

<p align="center">
  <img src="images/firebase_sign_in.png" height="300" />
</p>
<p align="center">Sign In Page</p>

### Step 3: Home Page (Signed In)
If login is sucessful, you should be redirected back to the same page. Click the `GO TO CONSOLE` button at the top right hand corner.

<p align="center">
  <img src="images/firebase_go_to_console.png" height="300" />
</p>
<p align="center">Home Page</p>

### Step 4: Console Page
You should be directed to their console, where you should see there's a project called `ClubSIM` with project ID `clubsim-d63ed`. Click on it.

<p align="center">
  <img src="images/firebase_projects.png" height="300" />
</p>
<p align="center">Console Page</p>

### Step 5: Project Overview Page
If everything checks out, you will make it to the `project overview page` of the ClubSIM project.

<p align="center">
  <img src="images/firebase_project_overview.png" height="300" />
</p>
<p align="center">Projects Page</p>

## Send Message
In order to send a message to a ClubSIM user, you have to
- send a Chinese message and a English through Firebase's iOS Notification Service
- send a Chinese message and a English through Firebase's Android Notification Service

Basically, you have to send four messages. The reason behind is mainly because you can't tell the user's language preference and they may hold devices on both Android and iOS platforms.

For starters, scroll to the bottom of the side menu, aka the navigation drawer. You should be able to see the option `Notifications`.

<p align="center">
  <img src="images/firebase_notification_option.png" height="500" />
</p>
<p align="center">Side menu</p>

Click on it and you should see a page similar to this:

<p align="center">
  <img src="images/firebase_notification_page.png" height="300" />
</p>
<p align="center">Notification Page</p>

For the subsequent sections, I'll be using the following scenario as demostration purpose:

Sending the following messages to a ClubSIM user with ID `1234567`
- Chinese: 那隻敏捷的棕毛狐狸躍過那隻懶狗
- English: The quick brown fox jumps over the lazy dog

### iOS
#### Step 1: Compose Message Page
First of all, click the blue button that says `NEW MESSAGE`.

<p align="center">
  <img src="images/firebase_new_msg_btn.png" height="150" />
</p>
<p align="center">New Message Button</p>

And you should be directed to the `Compose Message Page`.

<p align="center">
  <img src="images/firebase_compose_msg_page.png" height="300" />
</p>
<p align="center">Compose Message Page</p>

#### Step 2: Message Text
Naturally, input what you want to send on the `Message text` field:

<p align="center">
  <img src="images/eng_message_text.png" height="300" />
</p>
<p align="center">English Text</p>

#### Step 3: Segment: App
This is where things may get a little bit tricky. Check out the `Target` section. For now, you can see there's a drop down list called `Select app`. Click on it and choose the option that says `com.pccw.clubsim` with the iOS logo next to it.

<p align="center">
  <img src="images/ios_1.png" height="300" />
</p>
<p align="center">iOS</p>

<p align="center">
  <img src="images/ios_2.png" height="300" />
</p>
<p align="center">iOS</p>

#### Step 4: Segment: Club ID
See the word `AND` next to `com.pccw.clubsim` over there? Click on it, and you should see another row show up.

<p align="center">
  <img src="images/ios_club_id_1.png" height="300" />
</p>
<p align="center">Row</p>

Then click on the `Select...` dropdown list and hover to `User Property`, and a submenu should appear.

<p align="center">
  <img src="images/ios_club_id_2.png" height="300" />
</p>
<p align="center">Club ID Option</p>

Choose `clubid` and you should see your form now looks like this:
<p align="center">
  <img src="images/ios_club_id_3.png" height="300" />
</p>
<p align="center">Club ID Option</p>

Input the ID of the CLubSIM user onto the `Value` field.
<p align="center">
  <img src="images/ios_club_id_4.png" height="300" />
</p>
<p align="center">Club ID Value</p>

As for the `Select operator` dropdown list, click on it and choose `exact matches`.

<p align="center">
  <img src="images/ios_club_id_5.png" height="300" />
</p>
<p align="center">Club ID Operator Dropdown</p>

<p align="center">
  <img src="images/ios_club_id_6.png" height="300" />
</p>
<p align="center">Club ID Operator: Exact matches</p>

#### Step 5: Segment: Accept Push
Now you can repeat Step 4, but instead of choosing `clubid`, choose `acceptpush`. And set the `Value` field to `yes`.

<p align="center">
  <img src="images/ios_accept_push.png" height="300" />
</p>
<p align="center">Accept Push</p>

#### Step 6: Segment: Language
Repeat Step 4 again, but instead of choosing `clubid`, choose `language`. And set the `Value` field to `eng`, because you're sending an English message. And beware the `language` here is a custom user property, not the `Language` option Firebase offers as a default.

<p align="center">
  <img src="images/ios_language_eng.png" height="300" />
</p>
<p align="center">Language: English</p>

#### Step 7: Send English Message
Now you can scroll down to the bottom, and click the `SEND MESSAGE` button at the bottom right corner. A dialog should appear.

<p align="center">
  <img src="images/ios_send_dialog.png" height="300" />
</p>
<p align="center">Send English Message</p>

Hit `SEND` and you should be directed back to the `Notification Page`, where you can check the status of the message sending process, which should show `Completed` if the message is sent.

<p align="center">
  <img src="images/ios_send_status.png" height="200" />
</p>
<p align="center">Send Status</p>

Note that `Completed` here only means message is successfully sent according to the previous criterias you've set. It doens't mean the message is guaranteed to have reached your target user's device(s), majorly on which how you configure the criterias (`acceptpush`, `language` and `clubid`).

#### Step 8: Send Chinese Message
Repeat step 1 - 7. But before you sent the message, make sure your configuration matches the following:

<p align="center">
  <img src="images/ios_send_chi_msg.png" height="300" />
</p>
<p align="center">Language: Chinese</p>

where the `language` value is changed to `chi`.

### Android
#### Step 1: Send English Message
Repeat step 1 - 7 of the iOS Section, but make sure your configuration matches the following:

<p align="center">
  <img src="images/android_send_eng_msg.png" height="300" />
</p>
<p align="center">Language: English</p>

#### Step 2: Send Chinese Message
Same as Step 1, butmake sure your configuration matches the following:

<p align="center">
  <img src="images/android_send_chi_msg.png" height="300" />
</p>
<p align="center">Language: Chinese</p>

where
- the `App` field is changed to `com.pccw.clubsim` with the Android logo next to it
- the `language` value is changed to `zh`, not `chi`
- the `acceptpush` value is changed to `true`, not `yes`.

### Summary
For referencing pusposes, here's a table summarizing what you should choose for different fields on each platform:

|               | Android       | iOS    |
| ------------- |:-------------:| ------:|
| acceptpush    | true/false    | yes/no |
| language      | zh/en         | chi/eng|
