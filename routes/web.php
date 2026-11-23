<?php

use App\Http\Controllers\AcademyController;
use App\Http\Controllers\Admin\BookingController as AdminBookingController;
use App\Http\Controllers\Admin\DepartureController as AdminDepartureController;
use App\Http\Controllers\Admin\ReviewController as AdminReviewController;
use App\Http\Controllers\Admin\DashboardController as AdminDashboardController;
use App\Http\Controllers\Admin\DestinationController as AdminDestinationController;
use App\Http\Controllers\Admin\TourController as AdminTourController;
use App\Http\Controllers\Auth\AuthenticatedSessionController;
use App\Http\Controllers\Auth\RegisteredUserController;
use App\Http\Controllers\BookingController;
use App\Http\Controllers\ReviewController;
use App\Http\Controllers\DestinationController;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\MyBookingController;
use App\Http\Controllers\TourController;
use Illuminate\Support\Facades\Route;

Route::get('/', HomeController::class)->name('home');

Route::middleware('guest')->group(function () {
    Route::get('/register', [RegisteredUserController::class, 'create'])->name('register');
    Route::post('/register', [RegisteredUserController::class, 'store']);
    Route::get('/login', [AuthenticatedSessionController::class, 'create'])->name('login');
    Route::post('/login', [AuthenticatedSessionController::class, 'store']);
});

Route::post('/logout', [AuthenticatedSessionController::class, 'destroy'])
    ->middleware('auth')
    ->name('logout');

Route::middleware('auth')->group(function () {
    Route::get('/my-bookings', [MyBookingController::class, 'index'])->name('bookings.mine');
    Route::patch('/my-bookings/{booking}/cancel', [MyBookingController::class, 'cancel'])->name('bookings.mine.cancel');
});

Route::get('/tours', [TourController::class, 'index'])->name('tours.index');
Route::get('/tours/{tour:slug}', [TourController::class, 'show'])->name('tours.show');
Route::get('/tours/{tour:slug}/book', [BookingController::class, 'create'])->name('bookings.create');
Route::post('/tours/{tour:slug}/bookings', [BookingController::class, 'store'])->name('bookings.store');
Route::get('/booking/{booking:reference}', [BookingController::class, 'show'])->name('bookings.show');
Route::post('/booking/{booking:reference}/review', [ReviewController::class, 'store'])->name('bookings.review');

Route::get('/academy', [AcademyController::class, 'index'])->name('academy.index');
Route::get('/academy/glyphs', [AcademyController::class, 'glyphs'])->name('academy.glyphs');
Route::get('/academy/lessons/{lesson:slug}', [AcademyController::class, 'lesson'])->name('academy.lesson');
Route::get('/academy/name', [AcademyController::class, 'name'])->name('academy.name');
Route::get('/academy/quiz', [AcademyController::class, 'quiz'])->name('academy.quiz');

Route::middleware(['auth', 'admin'])->prefix('admin')->name('admin.')->group(function () {
    Route::get('/', AdminDashboardController::class)->name('dashboard');

    Route::get('/reviews', [AdminReviewController::class, 'index'])->name('reviews.index');
    Route::patch('/reviews/{review}/toggle', [AdminReviewController::class, 'toggle'])->name('reviews.toggle');
    Route::delete('/reviews/{review}', [AdminReviewController::class, 'destroy'])->name('reviews.destroy');

    Route::get('/bookings', [AdminBookingController::class, 'index'])->name('bookings.index');
    Route::get('/bookings/{booking:reference}', [AdminBookingController::class, 'show'])->name('bookings.show');
    Route::patch('/bookings/{booking:reference}/status', [AdminBookingController::class, 'updateStatus'])->name('bookings.status');

    Route::get('/tours', [AdminTourController::class, 'index'])->name('tours.index');
    Route::get('/tours/create', [AdminTourController::class, 'create'])->name('tours.create');
    Route::post('/tours', [AdminTourController::class, 'store'])->name('tours.store');
    Route::get('/tours/{tour:slug}/edit', [AdminTourController::class, 'edit'])->name('tours.edit');
    Route::put('/tours/{tour:slug}', [AdminTourController::class, 'update'])->name('tours.update');
    Route::delete('/tours/{tour:slug}', [AdminTourController::class, 'destroy'])->name('tours.destroy');
    Route::patch('/tours/{tour:slug}/toggle', [AdminTourController::class, 'toggle'])->name('tours.toggle');

    Route::post('/tours/{tour:slug}/departures', [AdminDepartureController::class, 'store'])->name('tours.departures.store');
    Route::patch('/tours/{tour:slug}/departures/{departure}/toggle', [AdminDepartureController::class, 'toggle'])->name('tours.departures.toggle');
    Route::delete('/tours/{tour:slug}/departures/{departure}', [AdminDepartureController::class, 'destroy'])->name('tours.departures.destroy');

    Route::get('/destinations', [AdminDestinationController::class, 'index'])->name('destinations.index');
    Route::get('/destinations/{destination:slug}/edit', [AdminDestinationController::class, 'edit'])->name('destinations.edit');
    Route::put('/destinations/{destination:slug}', [AdminDestinationController::class, 'update'])->name('destinations.update');
});

Route::get('/destinations', [DestinationController::class, 'index'])->name('destinations.index');
Route::get('/destinations/{destination:slug}', [DestinationController::class, 'show'])->name('destinations.show');
