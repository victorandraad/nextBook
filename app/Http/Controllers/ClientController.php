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
        ], [
            "name.required" => "invalid name",
            "check_in_date.required" => "invalid check in date",
            "check_in_date.date_format" => "invalid check in date",
            "check_out_date.required" => "invalid check out date",
            "check_ou_date.date_format" => "invalid check out date",
            "room_number.exists" => "invalid room number",
        ]);

        function isValidDate($date, $format = 'Y-m-d') {
            $d = \DateTime::createFromFormat($format, $date);
            return $d && $d->format($format) === $date;
        }

        $clientsBooks = Clients::select("check_in_date", "check_out_date")->where("room_number", $validateData["room_number"])->get();
        
        if (! $clientsBooks->isEmpty()) {
            foreach ($clientsBooks as $book) {
                $checkInDate = $book->check_in_date;
                $checkOutDate = $book->check_out_date;
    
                $checkOutDate = new \DateTime($checkOutDate);
                $checkInDate = new \DateTime($checkInDate);
                $inputCheckIn = new \DateTime($validateData["check_in_date"]);
    
                if ($inputCheckIn >= $checkInDate && $inputCheckIn <= $checkOutDate) {
                    return response()->json(["reserved"], 403);
                }
            }
        }

        $bookARoom = Clients::create([
            'name'=> $validateData["name"],
            'check_in_date'=> $validateData["check_in_date"],
            'check_out_date'=> $validateData["check_out_date"],
            'room_number'=> $validateData["room_number"],
        ]);

        return response()->json(["success"], 201);
    }
}
