// Authentication middleware has been disabled
// If you need to re-enable auth in the future, uncomment the original code

export default function middleware() {
  // Pass-through middleware that doesn't enforce authentication
  return;
}

export const config = {
  // The following matcher runs middleware on all routes
  // except static assets.
  matcher: [],
};
