<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

/**
 * Keeps the server's locale in step with the language the visitor is
 * using in the UI. The frontend stores its choice in a `locale` cookie,
 * and forms that submit a `locale` field win over it. Validation
 * messages, auth errors and other framework strings then come back in
 * the language the page is actually displayed in.
 */
class SetLocale
{
    /** Locales the UI ships. */
    private const SUPPORTED = ['ar', 'en'];

    public function handle(Request $request, Closure $next): Response
    {
        $locale = $request->input('locale')
            ?? $request->session()->get('locale')
            ?? $request->cookie('locale')
            ?? config('app.locale');

        if (is_string($locale) && in_array($locale, self::SUPPORTED, true)) {
            app()->setLocale($locale);
        }

        return $next($request);
    }
}
