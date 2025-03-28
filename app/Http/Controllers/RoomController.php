<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Rooms;

class RoomController extends Controller
{
    //
    public function index()
    {
        $rooms = Rooms::all();

        return response()->json($rooms);
    }
}
