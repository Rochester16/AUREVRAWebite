Implementation routing table — generated from IA + current code

Frontend routes (canonical)
- /                     -> HomePage (public, in `UserLayout`)
- /home                 -> HomePage (public)
- /shop                 -> ShopPage (public)
- /collection           -> Collection listing (public)
- /collection/:name     -> Collection filtered view (public)
- /product/:id          -> ProductDetail (public)
- /cart                 -> Cart (protected)
- /checkout             -> Checkout (protected)
- /wishlist             -> Wishlist (protected)
- /purchase             -> MyPurchase (protected)
- /success              -> Success (protected)
- /about                -> AboutUs (public)
- /contact              -> Contact (public)
- /user/login           -> LoginPage
- /user/register        -> RegisterPage
- /user/forgot-password -> ForgotPassword
- /account              -> Account/Profile (protected)

Admin routes (protected by AdminRoute)
- /admin/dashboard
- /admin/products
- /admin/products/add
- /admin/products/edit/:id
- /admin/products/history
- /admin/purchase-history
- /admin/users-created

API endpoints (backend)
Base: /api

Auth
- POST /api/auth/register          -> registerUser
- POST /api/auth/login             -> loginUser

Products
- GET  /api/products               -> getProducts (optionalAuth) • supports pagination /query?search
- GET  /api/products/:id           -> getProductById (optionalAuth)
- POST /api/products/add           -> addProduct (protect, adminOnly) + multipart image
- PUT  /api/products/:id           -> updateProduct (protect, adminOnly) + multipart image
- DELETE /api/products/:id         -> deleteProduct (protect, adminOnly)
- GET  /api/products/search?q=...  -> simple search (returns up to 10 results)

Cart
- GET  /api/cart/me                -> getCart (protect)
- POST /api/cart/add               -> addToCart (protect)
- PUT  /api/cart/update            -> updateCartItem (protect)
- DELETE /api/cart/remove          -> removeFromCart (protect)
- DELETE /api/cart/clear           -> clearCart (protect)

Wishlist
- GET  /api/wishlist/me           -> getMyWishlist (optionalAuth)
- POST /api/wishlist/add          -> addToWishlist (protect)
- DELETE /api/wishlist/remove     -> removeFromWishlist (protect)
- DELETE /api/wishlist/clear      -> clearWishlist (protect)

History
- GET  /api/history               -> combined history (protect, adminOnly)
- POST /api/history/add/purchase  -> add purchase history
- POST /api/history/add/user      -> add user-created history
- POST /api/history/add/admin     -> add admin-created history

Product history
- GET /api/history/products       -> product logs (protect, adminOnly)

Purchase history
- POST /api/history/purchases/add/purchase -> (protect)

User history
- GET /api/history/users           -> (protect, adminOnly)

Uploads
- Static files served at /uploads/<filename> (express static middleware)

Gaps & notes
- Search endpoint exists under /api/products/search but frontend also uses GET /products with query params; ensure consistent usage.
- Some frontend links used hardcoded `http://localhost:5000/uploads/...` — replaced with helper `src/utils/uploadUrl.js`.
- Need endpoints for orders/checkout processing (I see purchase history routes, but not a clear `orders` API). If you need order creation (checkout endpoint), add `POST /api/orders`.
- Ensure CORS and proxy are set (frontend `package.json` already has `proxy: http://localhost:5000`).

Next steps
1. Verify backend running and run smoke tests.
2. Create any missing frontend placeholders and wire pages to API.
3. Add seed/sample data and run end-to-end flows.

