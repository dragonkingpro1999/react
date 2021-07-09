<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Lead extends Model
{
    protected $fillable = [
        'name', 
        'email', 
        'phone', 
        'picture',
        'address',
        'user_id',
        'progress',
        'status',
        'earnings',
        'expenses',
        'net',
        'description'
    ];
}
