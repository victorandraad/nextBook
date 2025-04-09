<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Rooms extends Model
{
    //
    use HasFactory;

    protected $table = 'rooms'; // Especifica a tabela associada ao modelo
    protected $primaryKey = 'room_number'; // Define a chave primária, se necessário

    // Caso queira permitir a inserção de alguns campos no banco
    protected $fillable = ['room_number', 'living_quarters', 'beds', 'balcony'];
}
