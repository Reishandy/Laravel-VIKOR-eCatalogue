# Rei's eCatalogue - A simple eCatalogue web app with VIKOR recommendation

Rei's eCatalogue is a small Laravel + Inertia application that demonstrates a product catalogue with multi-criteria decision support using the VIKOR method. It includes an admin area (items & criteria management) and a public listing with optional VIKOR/SPK ranking using user-supplied criterion weights.

Live Demo: https://ecatalogue.reishandy.id (may be slow)

## Key features

- Item management with image upload (images converted to WebP and stored in the public disk)
- Criteria management (including a default immutable "Price" cost criterion)
- Decision support using the VIKOR algorithm (server-side) for multi-criteria ranking
- Inertia + frontend (Vue/React/TSX) views for an SPA-like experience
- Authentication and registration using Laravel Fortify with email verification and optional 2FA
- Database seeders that create realistic sample data (50 items, many criteria) for quick demos

## Technology stack

- PHP 8.2 + Laravel 12 (app skeleton and routing)
- Inertia.js for server-driven single page app views
- Laravel Fortify for authentication and registration
- Intervention Image for image processing and WebP encoding
- SQLite (default in repo) or other DB supported by Laravel
- Node.js tooling (Vite) for frontend assets

## Quick setup

1. Clone the repository
   ```bash
   git clone https://github.com/Reishandy/Laravel-VIKOR-eCatalogue
   cd Laravel-VIKOR-eCatalogue
   ```

2. Install PHP dependencies
   ```bash
   composer install
   ```

3. Install JavaScript dependencies
   ```bash
   npm install
   ```

4. Copy environment file and generate the app key
   ```bash
   cp .env.example .env
   php artisan key:generate
   ```

5. Configure `.env` (database, mail, storage)

- Database: the repository contains an example SQLite at `database/database.sqlite`. To use it, set in `.env`:

```env
DB_CONNECTION=sqlite
DB_DATABASE="/full/path/to/repository/database/database.sqlite"
```

- Mail: configure `MAIL_MAILER`, `MAIL_HOST`, `MAIL_PORT`, `MAIL_USERNAME`, `MAIL_PASSWORD`, `MAIL_FROM_ADDRESS`, etc. Email verification requires valid mail settings or a local mail catcher.

- Filesystem: public disk should be configured (default Laravel setup stores files in `storage/app/public` and exposes via `php artisan storage:link`).

6. Run migrations and seeders

```bash
php artisan migrate --seed
```

This will create the database schema and seed a demo user, criteria (including a default Price criterion), 50 demo items, and pivot values for each item's criteria.

7. Build frontend assets (for production) or run dev server

```bash
npm run build   # production build
npm run dev     # development with Vite
```

8. Start the Laravel development server

```bash
php artisan serve
```

Then open http://127.0.0.1:8000

## Project details and architecture

- Routes
  - Public home: GET `/` — handled by `App\Http\Controllers\Public\PublicController` which supports searching and optional SPK/VIKOR ranking via a `spk_weights` JSON parameter.
  - Authenticated area (middleware `auth,verified`) exposes CRUD for criteria (`App\Http\Controllers\Criterion\CriterionController`) and items (`App\Http\Controllers\Item\ItemController`). See `routes/web.php` for details.

- Models
  - `App\Models\Item` — stores name, description, image path, belongsToMany `Criterion` via `criterion_item` pivot (with `value`). Images are returned via Storage URL using an accessor.
  - `App\Models\Criterion` — stores name, description, unit, type (`benefit` or `cost`), and `max_value`. The `Price` criterion is treated as special (cannot be deleted).
  - `App\Models\User` — stores company metadata (name, email, description, address, currency, logo) used for the public listing header.

- VIKOR algorithm
  - Implemented server-side in `PublicController::applyVikorRanking`. It expects a JSON map of criterionId => weight (the `spk_weights` request parameter). It normalizes weights, computes best/worst per criterion (respecting cost/benefit), computes S, R, and Q values and returns items ordered by ascending Q (lower is better). The controller paginates the ranked collection manually to preserve ordering.

- Image handling
  - `App\Services\ImageStorageService` processes uploaded images using Intervention Image, encodes them to WebP, stores on the configured `public` disk with a UUID filename, and optionally deletes old images when updating.

- Seeders
  - `Database\Seeders\DatabaseSeeder` creates a demo user and criteria (Price, Quality, Features, Durability + random criteria). It creates 50 demo items and attaches a realistic pivot `value` for every criterion using helper methods that approximate price ranges, quality/features/durability scores etc.

## Contributing

Contributions are welcome. Suggested areas:
- Frontend improvements (accessibility, performance)
- Add more unit/integration tests for the VIKOR algorithm
- Improve seeder realism and add factories for edge cases

## License

Rei's eCatalogue is open-source software licensed under the [GNU Affero General Public License v3.0](LICENSE).

## Author

Created by: **Reishandy**
- GitHub: [https://github.com/Reishandy](https://github.com/Reishandy)
- Website: [https://reishandy.id](https://reishandy.id)
