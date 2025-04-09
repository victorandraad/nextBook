<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Clients extends Model
{
    //
    use HasFactory;

    protected $table = 'clients'; // Especifica a tabela associada ao modelo
    protected $primaryKey = 'id'; // Define a chave primária, se necessário

    // Caso queira permitir a inserção de alguns campos no banco
    protected $fillable = ['name', 'check_in_date', 'check_out_date', 'room_number'];
}
