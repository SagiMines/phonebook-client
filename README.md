# Phonebook - Client Repository

<div align='center'>
<img src='https://lh3.googleusercontent.com/pw/ADCreHcw1MCcyUzPoegjnXSRx2U-YrjjmzkwabyscP6F_vUOcModeHRNqH0fyofnF7DT-0b9_WIcg9MJra8krITPN2HuP2POe7O2wgq-IRfZuqVVY8rw-BVig7fFgTm3cByQVFr_sLonvHXCoQAU9spLM1ij=w831-h480-s-no?authuser=3' width=600 />
</div>

Welcome to Phonebook, an open-source web application that simplifies contact management. Phonebook allows users to store contact information, including full names, nicknames, phone numbers, addresses, and photos. Users can add, delete, update, and search for contacts with ease. This project is developed using React for the frontend and Node.js with NestJS for the backend. The client-server communication is powered by GraphQL, and all data is stored in a PostgreSQL database. The server and database are Dockerized for easy deployment and scalability.

## Table of Contents

- [Overview](#overview)
- [Technology Stack](#technology-stack)
- [Features](#features)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Usage](#usage)
- [Related](#related)

## Overview

Phonebook simplifies contact management, making it easy to store and organize your contacts. Whether you're a personal user or a business, Phonebook can help you manage your contacts efficiently.

### Technology Stack

- **Frontend:** Phonebook's frontend is developed using React, providing a responsive and user-friendly interface.

- **Backend:** The backend is powered by Node.js with NestJS, offering a structured and scalable architecture for managing contact data.

- **Client-Server Communication:** GraphQL is used to facilitate efficient and flexible communication between the client and server.

- **Database:** All contact data is stored in a PostgreSQL database, ensuring data integrity and reliability.

- **Dockerization:** Both the server and database are Dockerized, simplifying deployment and scalability.

### Features

- **Contact Management:** Users can add, delete, update, and search for contacts.
- **Contact Details:** Store full names, nicknames, phone numbers, addresses, and photos for each contact.
- **Efficient Communication:** GraphQL enables efficient and precise data exchange between the client and server.

## Getting Started

To set up Phonebook client, firstly, make sure you installed the [Phonebook server](https://github.com/SagiMines/phonebook-server) locally.  
Then, to install Phonebook client locally or deploy a similar platform, follow these steps:

1. Clone this repository to your local machine.

```bash
git clone https://github.com/SagiMines/phonebook-client.git
cd phonebook-client
```

2. Install the necessary dependencies.

```bash
npm install
```

3. Configure your environment variables using - [Environment Variables Guidence](#environment-variables).

4. Run the application locally for development.

```bash
npm run start
```

## Environment Variables

To run Phonebook client, you will need to add a folder in your `src` folder named: **`config`**.
Inside the config folder create a new file named: **`config.json`**, create a JSON variable with the following attributes:

**Server Route:**

`SERVER_URL` - Your server route.

**AWS S3 connection:**

`S3_BUCKET_NAME` - Your AWS user S3 bucket name.  
`S3_DIR_NAME` - Your AWS user S3 dir name.  
`S3_REGION` - Your AWS user S3 chosen region.  
`S3_ACCESS_KEY` - Your AWS user S3 access key.  
`S3_ACCESS_SECRET_KEY` - Your AWS user S3 access secret key.

## Usage

Once Phonebook is set up, users can:

- Add new contacts with full name, nickname, phone number, address, and photo.
- Delete, update, or search for specific contacts.
- Efficiently manage their contact list.

## Related

[Phonebook Server Repository](https://github.com/SagiMines/phonebook-server)

Efficiently manage your contacts with Phonebook!
