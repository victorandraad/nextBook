<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Clients;

class ClientController extends Controller
{
    //
   
    public function store(Request $request)
    {

        $validateData = $request->validate([
            'name' => 'required|string|max:255', 
            'check_in_date' => 'required|date|date_format:Y-m-d', 
            'check_out_date' => 'required|date|date_format:Y-m-d|after:check_in_date', 
            'room_number' => 'required|integer|exists:rooms,room_number',
        ]);

        $bookARoom = Clients::create([
            'name'=> $validateData["name"],
            'check_in_date'=> $validateData["check_in_date"],
            'check_out_date'=> $validateData["check_out_date"],
            'room_number'=> $validateData["room_number"],
        ]);

        return response()->json([$bookARoom], 201);
    }
}
