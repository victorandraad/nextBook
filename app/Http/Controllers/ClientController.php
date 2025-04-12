<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Clients;

class ClientController extends Controller
{
    //
   
    public function store(Request $request)
    {

        // deixar a validacao por assim mesmo, se o front vier a ter problemas para validar a mensagem
        // de erro, trocar por $request->input(); assim eu consigo validar separadamente e mostrar um erro 
        // diferente para cada excecao.
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
            "check_out_date.date_format" => "invalid check out date",
            "room_number.exists" => "invalid room number",
        ]);

        //! Ainda não é necessária, mas pode vir a ser no futuro
        // function isValidDate($date, $format = 'Y-m-d') {
        //     $d = \DateTime::createFromFormat($format, $date);
        //     return $d && $d->format($format) === $date;
        // }

        // if (! isValidDate($validateData["check_out_date"]) || ! isValidDate($validateData["check_out_date"])) {
        //     return response()->json(["invalid date"], 403);
        // }

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

    public function unbook(Request $request)
    {
        $validateData = $request->validate([
            'check_in_date' => 'required|date|date_format:Y-m-d', 
            'check_out_date' => 'required|date|date_format:Y-m-d|after:check_in_date', 
            'room_number' => 'required|integer'
        ]);

        $clientsBooks = Clients::where("check_in_date", $validateData["check_in_date"])->where("room_number", $validateData["room_number"])->where("check_out_date", $validateData["check_out_date"]);
        //delete from Clients where room_number = input & check_in = input & check_out = input
        $deleted = $clientsBooks->delete();

        if ($deleted > 0) {
            return response()->json([
                'message' => 'reserva cancelada com sucesso',
                'deleted_records' => $deleted,
                'data'=> $validateData], 200);
        } else {
            return response()->json([
                'message'=> 'Nenhuma reserva encontrada com os dados fornecidos.',
                'data'=> $validateData
            ], 404);
        }

        return response()->json([$validateData], 201);
        
    }

    public function getBooks(Request $request){

        $validateData = $request->validate([
            'room_number' => 'required|integer|exists:rooms,room_number',
        ]);

        $clientsBooks = Clients::select("check_in_date", "check_out_date", "name", "id")->where("room_number", $validateData["room_number"])->get();

        return response()->json($clientsBooks, 201);

    }

    // $clientsBooks = Clients::select("check_in_date", "check_out_date")->where("room_number", $validateData["room_number"])->get();
    
    // $teste = Clients::select("room_number")

    }
