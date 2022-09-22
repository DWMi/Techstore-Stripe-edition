TechStore stripe edition!

Julius Djudjaku, David Wong, Antonio Piattelli


Assignment description (in Swedish):

I den här inlämningen skall ni skapa en webbshop där det går att lägga en order och genomföra en betalning med integration med Stripe. När betalningen är godkänd skall ordern sparas i en JSON-fil på servern. I samband med att en order läggs skall även en ny Customer skapas (formulär för denna information måste skapas i checkout). Här hittar ni info om giltiga testkort på Stripe: https://stripe.com/docs/testing.
För väl godkänt skall ni implementera en registrering och inloggingstjänst samt utföra all hantering av produkter genom Stripe (produkterna skapas i Stripes CMS). Då en ny kund registrerar sig skall denna sparas som en ”customer" i Stripe. Användarnamn/email och krypterat lösenord skall sparas i en JSON-fil på servern. Använd den inloggade customern när ny order placeras.
Ni väljer själva om ni vill använda en utökad utvecklings-stack i projektet, notera att detta inte är ett krav. Exempel på ramverk ni kan lägga till i er stack är: typescript, react, mm. Det är även tillåtet att utgå ifrån projektet ni gjorde i ramverkskursens. Låt kreativiteten flöda!
Notera: Ni får ett basprojekt att utgå ifrån så vill ni använda något annat ramverk på klient-sida såsom React får ni bygga detta själva.
För att bli godkänd på den här uppgiften MÅSTE ni använda GIT och GitHub. Inlämningen sker som vanligt via It ́s Learning där lämnar in er projektmapp som en zip- fil. I projektmappen ska det finnas (utöver all kod) en README.md fil som innehåller en titel, beskrivning av uppgiften, vilka krav som uppfyllts, vad som krävs för att bygga och starta projektet samt en länk till GitHub repot. ”node_modules”-mappen skall tas bort innan inlämning! Notera att om instruktioner för hur projektet byggs och startas inte finns eller om instruktionerna är felaktiga kommer uppgiften bli underkänd.
Uppgiften skall genomföras i grupper om 3 - Ni delar själva upp er i grupper.
Läs noga igenom hela uppgiftsbeskrivningen tillsammans innan ni börjar.


Requirements for passing:
1. The information is submitted on time. ✅
2. Products must be listed on one page. ✅
3. It must be possible to add products to a shopping cart. ✅
4. Based on the shopping cart, it should be possible to place an order through Stripe. ✅
5. A "Customer" must be created in Stripe in connection with placing a new order (this requires a form to enter the information Stripe requests). Validation on this forms/input fields must be present. ✅
6. All placed orders must be saved to a list in a JSON file. ✅
7. Under no circumstances may the order be placed without completed payment! (i.e. Never save an order item unless you have received confirmation back from Stripe that the payment has gone through) ✅


Requirements for successfully passed:
1. All points for pass are met ✅
2. You must be able to register as a user in the web shop. This should result in that a "Customer" is created in Stripe (all passwords must be saved hashed). ✅
3. You must be able to log in as a customer. The logged in customer (which is also saved in Stripe) must be used when placing orders. ✅
4. As logged in, you must be able to see your placed orders. ✅
5. You must not be able to place an order if you are not logged in. ✅
6. Products displayed and purchased must be collected from Stripe. ✅


How tu run:

npm install
npm start

Users and Orders are wiped, so you need to sign up and create an account in order to test the functionalities!

Github repo: https://github.com/DWMi/Techstore-Stripe-edition

Ciao! 👌🏻

