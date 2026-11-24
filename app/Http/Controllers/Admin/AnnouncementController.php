<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Announcement;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class AnnouncementController extends Controller
{
    public function edit(): Response
    {
        return Inertia::render('Admin/Announcement', [
            'announcement' => Announcement::singleton()->only('text_ar', 'text_en', 'link', 'is_active'),
        ]);
    }

    public function update(Request $request): RedirectResponse
    {
        $data = $request->validate([
            'text_ar' => ['required', 'string', 'max:180'],
            'text_en' => ['required', 'string', 'max:180'],
            'link' => ['nullable', 'string', 'max:255'],
            'is_active' => ['boolean'],
        ]);

        Announcement::singleton()->update($data);

        return back();
    }
}
