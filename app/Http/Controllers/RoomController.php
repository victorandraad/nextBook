<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Rooms;
use App\Models\Clients;
class RoomController extends Controller
{
    //
    public function index()
    {
        $rooms = Rooms::all();

        return response()->json($rooms);
    }
}
