<?php

namespace App\Http\Middleware;

use App\Models\User;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class HandleSingleAccount
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $userCount = User::count();
        $hasUser = $userCount > 0;

        if (!$hasUser && !$request->is('register')) {
            return redirect()->route('register');
        }

        if ($hasUser && $request->is('register')) {
            return redirect()->route('login');
        }

        return $next($request);
    }
}
