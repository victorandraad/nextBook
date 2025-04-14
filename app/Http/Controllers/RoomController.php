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

    public function store(Request $request)
    {
        $validateData = $request->validate([
            'room_number' => 'required|integer|unique:rooms,room_number',
            'living_quarters' => 'required|integer|min:1',
            'beds' => 'required|integer|min:1',
            'balcony' => 'required|boolean',
        ], [
            'room_number.required' => 'O número do quarto é obrigatório',
            'room_number.unique' => 'Este número de quarto já existe',
            'living_quarters.required' => 'O número de pessoas é obrigatório',
            'beds.required' => 'O número de camas é obrigatório',
            'balcony.required' => 'A informação sobre varanda é obrigatória',
        ]);

        $room = Rooms::create($validateData);

        return response()->json($room, 201);
    }
}
