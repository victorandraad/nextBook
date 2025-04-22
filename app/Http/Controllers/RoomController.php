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

    public function destroy($roomNumber)
    {
        $room = Rooms::find($roomNumber);

        if (!$room) {
            return response()->json(['message' => 'Quarto não encontrado'], 404);
        }

        // Check if the room has any active reservations
        $hasReservations = Clients::where('room_number', $roomNumber)->exists();

        if ($hasReservations) {
            return response()->json(['message' => 'Não é possível deletar um quarto com reservas ativas'], 403);
        }

        $room->delete();

        return response()->json(['message' => 'Quarto deletado com sucesso'], 200);
    }

    public function update(Request $request, $roomNumber)
    {
        $room = Rooms::find($roomNumber);

        if (!$room) {
            return response()->json(['message' => 'Quarto não encontrado'], 404);
        }

        $validateData = $request->validate([
            'living_quarters' => 'required|integer|min:1',
            'beds' => 'required|integer|min:1',
            'balcony' => 'boolean',
        ], [
            'living_quarters.required' => 'O número de pessoas é obrigatório',
            'living_quarters.min' => 'O número de pessoas deve ser maior que 0',
            'beds.required' => 'O número de camas é obrigatório',
            'beds.min' => 'O número de camas deve ser maior que 0',
        ]);

        $room->update($validateData);

        return response()->json($room, 200);
    }
}
