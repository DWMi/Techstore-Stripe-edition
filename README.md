Requirements for passing:
1. The information is submitted on time.
2. Products must be listed on one page. ✅
3. It must be possible to add products to a shopping cart. ✅
4. Based on the shopping cart, it should be possible to place an order through Stripe. ✅
5. A "Customer" must be created in Stripe in connection with placing a new order (this requires a form to enter the information Stripe requests). Validation on this forms/input fields must be present.
6. All placed orders must be saved to a list in a JSON file.
7. Under no circumstances may the order be placed without completed payment! (i.e. Never save an order item unless you have received confirmation back from Stripe that the payment has gone through)


Requirements for successfully passed:
1. All points for pass are met
2. You must be able to register as a user in the web shop. This should result in that a "Customer" is created in Stripe (all passwords must be saved hashed).
3. You must be able to log in as a customer. The logged in customer (which is also saved in Stripe) must be used when placing orders.
4. As logged in, you must be able to see your placed orders.
5. You must not be able to place an order if you are not logged in.
6. Products displayed and purchased must be collected from Stripe.