<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureAdmin
{
    /**
     * Only authenticated admins may pass. Guests are sent to login by the
     * `auth` middleware that runs before this one (and defensively here);
     * signed-in non-admins get a hard 403.
     */
    public function handle(Request $request, Closure $next): Response
    {
        if (! $request->user()) {
            return redirect()->route('login');
        }

        abort_unless($request->user()->is_admin, 403);

        return $next($request);
    }
}
