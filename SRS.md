Below are **descriptive user feature flows** for each user of the **GamanLk** platform. These describe how each user interacts with the system from start to finish.

---

# 1. Tourist Feature Flow

A tourist can browse the website without creating an account. They can explore destinations, tour packages, experiences, featured tours, featured experiences, and customer reviews. The tourist can also search and filter packages, destinations, and experiences based on their preferences.

When the tourist decides to make a booking, they must first create an account and log in. After logging in, they can either book a **Standard Tour Package** or create a **Customized Tour**.

For a standard booking, the tourist selects a published package, chooses the travel date, number of passengers, and preferred vehicle (if applicable), reviews the package details and price, and confirms the booking.

For a customized booking, the tourist creates their own itinerary by selecting destinations, experiences, travel dates, passenger count, and vehicle type. Throughout this process, the system provides intelligent recommendations, such as suggested destinations, experiences, and suitable vehicles based on the selected passenger count and itinerary. The tourist may also add recommended items to the cart before confirming the booking.

Once the customized itinerary is completed, the system broadcasts the booking request to eligible drivers. Drivers submit their offers based on the system-suggested price. The tourist receives multiple offers, compares drivers based on price, rating, ETA, and vehicle details, and selects the preferred driver. After confirmation, the tourist can view booking details, booking history, and trip status.

After completing a tour, the tourist can submit reviews and ratings for drivers, experiences, and tour packages. They can also manage their profile, update personal information, and view previous reviews and bookings.

---

# 2. Driver Feature Flow

A driver begins by registering on the platform and creating a profile with personal information, contact details, driving license information, and vehicle details. After logging in, the driver manages their profile and vehicle information whenever necessary.

The driver can register one or more vehicles by providing vehicle type, capacity, images, pricing information, and availability. These vehicles become available for tour package creation and customized booking requests.

Drivers can create tourism experiences that they personally provide, such as city tours or guided visits. They can also update or remove these experiences when required.

The driver creates standard tour packages by selecting destinations and adding experiences. These experiences may be their own or those created by registered experience suppliers. After entering package details, itinerary, duration, pricing, and vehicle information, the package is published for tourists to book.

When a tourist books one of the driver's published packages, the driver receives the booking notification and manages the booking throughout the tour.

For customized bookings, the driver receives booking requests broadcast by the system based on the selected vehicle type or a specific vehicle. The driver reviews the itinerary, system-suggested price, travel dates, and passenger information before deciding whether to accept the suggested price or submit a counter-offer within the permitted range.

Once the tourist accepts the driver's offer, the booking is confirmed. The driver can then manage the trip, view booking history, monitor upcoming tours, and maintain their availability for future bookings.

---

# 3. Experience Supplier Feature Flow

An experience supplier registers on the platform and creates a profile containing business information, contact details, service location, and experience category.

After logging in, the supplier creates tourism experiences such as cooking classes, village tours, boat tours, cart tours, wildlife activities, cultural experiences, or adventure activities. Each experience includes descriptions, pricing, duration, operating hours, capacity, location, and images.

The supplier can update, activate, deactivate, or remove experiences whenever necessary. These published experiences become available for drivers when creating standard tour packages and for tourists during customized tour planning.

The supplier manages their profile, monitors their listed experiences, and updates service information whenever required.

---

# 4. Administrator Feature Flow

The administrator logs into the administration portal to manage the overall platform.

The administrator manages all registered users, including tourists, drivers, and experience suppliers. They can activate or deactivate user accounts when necessary.

The administrator oversees all standard tour packages created by drivers. Packages can be edited, marked as featured, activated, or deactivated to improve visibility or remove outdated content.

Similarly, the administrator manages all experiences created by drivers and experience suppliers. Experiences can be edited, marked as featured, activated, or deactivated based on business requirements.

The administrator monitors customer inquiries submitted through the platform, responds to inquiries, and updates their status once resolved.

The administrator also manages customer reviews by viewing reported reviews and removing inappropriate or misleading content when necessary.

Through the administration dashboard, the administrator monitors platform statistics such as registered users, active drivers, bookings, popular destinations, popular experiences, featured packages, and overall platform performance. This helps maintain service quality and support business decision-making.

---

## Overall System Flow

```
Visitor
   │
   ├── Browse Website
   │
   ├── Register / Login
   │
   ├── Select Booking Type
   │      │
   │      ├── Standard Package
   │      │        │
   │      │        └── Confirm Booking
   │      │
   │      └── Customized Tour
   │               │
   │               ├── Select Destinations
   │               ├── Select Experiences
   │               ├── Select Vehicle
   │               ├── Receive Recommendations
   │               ├── Broadcast to Drivers
   │               ├── Compare Driver Offers
   │               ├── Select Driver
   │               └── Confirm Booking
   │
   ├── Complete Tour
   ├── Submit Review
   └── View Booking History
```

These flows are suitable for the **User Features** or **System Flow** section of your SRS and align with the functionality described in your project epics.
Got it. You don't need an IEEE SRS. You need the **content** that can be directly added to your SRS or project report.

---

# Project Name

**GamanLk – Smart Tour Booking and Tour Management Platform**

---

# Project Description

GamanLk is a web-based tourism platform that connects tourists, drivers, and experience suppliers through a single system. Tourists can browse destinations, experiences, and tour packages, create customized tours or book standard tour packages, while drivers and experience suppliers can publish their services. The platform also provides intelligent recommendations and a driver broadcasting system for customized bookings.

---

# Users of the System

### 1. Tourist

A visitor who uses the platform to discover destinations, experiences, vehicles, and book tours.

### 2. Driver

A registered driver who owns one or more vehicles and offers tour packages and transportation services.

### 3. Experience Supplier

A service provider who offers tourism experiences such as:

* Cooking Classes
* Village Tours
* Boat/Oru Tours
* Cart Tours
* Hiking
* Cultural Shows
* Wildlife Safari
* Water Sports
* Tea Factory Tours
* Camping
* etc.

### 4. Administrator

System administrator responsible for managing the entire platform.

---

# Main Features

## Authentication

* Sign Up
* Sign In
* Forgot Password
* Email Verification
* Profile Management
* Change Password

---

## Tourist Features

### Public Website

* View destinations
* View experiences
* View tour packages
* View featured packages
* View featured experiences
* View reviews
* Search destinations
* Search experiences
* Search packages

### Account

* Register
* Login
* Manage profile

### Booking

* Book Standard Tour Package
* Create Customized Tour
* Select destinations
* Select experiences
* Select vehicles
* Select travel dates
* Select passenger count
* View booking summary
* Confirm booking
* View booking history
* Cancel booking

### Customized Tour

* Create own travel route
* Add multiple destinations
* Add experiences
* Select vehicle type
* Receive recommendations
* Receive vehicle suggestions
* Receive experience suggestions
* Broadcast request to drivers
* Compare driver offers
* Select preferred driver

### Cart

* Add destinations
* Add experiences
* Add vehicles
* Remove items
* Update cart
* Checkout

### Reviews

* Write reviews
* View own reviews
* Edit reviews
* Delete reviews

---

## Driver Features

### Profile

* Register
* Login
* Manage profile

### Vehicle Management

* Add vehicle
* Edit vehicle
* Remove vehicle
* Upload vehicle images
* Manage availability

### Experience Management

* Create experiences
* Update experiences
* Delete experiences

### Tour Package Management

* Create standard package
* Add destinations
* Add own experiences
* Add supplier experiences
* Edit package
* Publish package
* Deactivate package

### Booking Management

* Receive customized booking requests
* Receive package bookings
* Accept booking
* Reject booking
* Submit price offer
* View booking history

---

## Experience Supplier Features

### Profile

* Register
* Login
* Manage profile

### Experience Management

* Create experiences
* Update experiences
* Delete experiences
* Upload images
* Set pricing
* Set availability

---

## Administrator Features

### User Management

* Manage tourists
* Manage drivers
* Manage experience suppliers
* Activate accounts
* Deactivate accounts

### Tour Package Management

* Mark package as Featured
* Activate package
* Deactivate package
* Edit package

### Experience Management

* Mark experience as Featured
* Activate experience
* Deactivate experience
* Edit experience

### Inquiry Management

* View inquiries
* Reply inquiries
* Close inquiries

### Review Management

* View reviews
* Remove inappropriate reviews
* Manage reported reviews

### Dashboard

* View statistics
* View bookings
* View users
* View revenue
* View reports

---

# Intelligent Features

## Recommendation System

During customized booking, the system recommends:

### Destination Recommendations

* Popular nearby destinations
* Frequently visited destinations
* Suggested next destinations

### Experience Recommendations

* Experiences available at selected destinations
* Popular experiences
* Experiences matching tourist interests

### Vehicle Recommendations

Vehicle suggestions based on:

* Passenger count
* Route distance
* Number of luggage
* Comfort level

Example:

* 2 passengers → Car
* 5 passengers → SUV
* 8 passengers → KDH Van
* 15 passengers → Mini Bus

---

# Broadcast Booking System

After creating a customized booking:

* Tourist selects vehicle type or exact vehicle.
* System broadcasts the booking request.

If the tourist selects:

**Vehicle Type (e.g., KDH Van)**

→ All available drivers who own a KDH receive the request.

If the tourist selects:

**Specific Vehicle (e.g., Tharuka's KDH Van)**

→ Only that driver's account receives the booking request.

Drivers can:

* View request details
* View suggested system price
* Accept the suggested price
* Submit a counter offer (within the allowed range)

Tourist can:

* Compare driver offers
* Compare ratings
* Compare prices
* Compare ETA
* Select the preferred driver

---

# Booking Types

### 1. Standard Booking

* Predefined tour package
* Created by drivers
* Fixed itinerary
* Fixed price

### 2. Customized Booking

* Tourist creates the itinerary
* Chooses destinations
* Chooses experiences
* Chooses vehicle
* Receives driver offers

---

# Notifications

* Booking confirmation
* Booking cancellation
* Driver offer received
* Booking accepted
* Booking rejected
* Review reminders
* Inquiry responses
* Account notifications

---

# Search Features

Search by:

* Destination
* Tour Package
* Experience
* Driver
* Vehicle Type

---

# Reports (Admin)

* Total Users
* Total Bookings
* Active Drivers
* Active Experience Suppliers
* Revenue Report
* Popular Destinations
* Popular Experiences
* Most Booked Packages
* Vehicle Usage Report

---

# Future Enhancements

* AI itinerary generation
* Weather recommendations
* Multi-language support
* Live driver tracking
* Online payments
* Hotel booking integration
* Flight integration
* Chat between tourist and driver
* Loyalty and rewards system

This structure is simple, comprehensive, and well-suited for a university project SRS without following the formal IEEE template.refer this doc and list down the all the pages must have develop for the system 

