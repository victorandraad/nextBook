<?php

use App\Http\Controllers\RoomController;
use App\Http\Controllers\ClientController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');
});

Route::get("/all-rooms", [RoomController::class, 'index']);

Route::post('/book-a-room', [ClientController::class, 'store']);

Route::post('/delete-book', [ClientController::class, 'unbook']);

Route::post('/books', [ClientController::class, 'getBooks']);

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
