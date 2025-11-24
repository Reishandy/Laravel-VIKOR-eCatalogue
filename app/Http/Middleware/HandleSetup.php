<?php

namespace App\Http\Middleware;

use App\Models\User;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class HandleSetup
{
    /**
     * Handle an incoming request.
     *
     * @param \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response) $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $user = User::first();

        // If no user exists, redirect to registration page
        // just in case since this should be handled by HandleSingleAccount middleware
        if (!$user && !$request->is('register')) {
            return redirect()->route('register');
        }

        // If the field company_name is not set and logged in, redirect to setup page
        if ($user && empty($user->company_name) && !$request->is('setup') && $request->user()) {
            return redirect()->route('setup.index');
        }

        // If the field company_name is set and on setup page, redirect to home
        if ($user && !empty($user->company_name) && $request->is('setup')) {
            return redirect()->route('dashboard');
        }

        return $next($request);
    }
}
