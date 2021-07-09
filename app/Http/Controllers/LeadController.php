<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use App\Http\Controllers\APIController;
use App\Http\Resources\TodoCollection;
use App\Http\Resources\TodoResource;
use App\Lead;
use App\User;
use App\Todo;
use DB;
class LeadController extends ApiController
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {

        
        $leads = Lead::orderby('id','desc')->get();
        

        return response()->json([
            'status' => 200,
            'data' => $leads
        ]);

    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        try {
            $user = User::first();
            
            $newLead = [
                'user_id'     => $user->id,
                'name'        => $request['name'],
                'email'       => $request['email'],
                'phone'       => $request['phone'],
                'address'     => $request['address'],
                'description' => $request['description'],
                'progress'    => $request['progress'],
                'status'      => $request['status'],
                'earnings'    => $request['earnings'],
                'expenses'    => $request['expenses'],
                'net'         => $request['net'],
            ];

            if ($new = Lead::create($newLead)) {
                return response()->json([
                    'status' => 201,
                    'message' => 'Lead successfully saved',
                    'status' => 'success',
                    'data' => $new
                ], 201);;
            } else {
                
            }
            DB::comit();
        } catch (Exception $e) {
            DB::rollback();
            return response()->json([
                'message' => 'Something went wrong',
                'status' => 500
            ]);
        }
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        // Get user from $request token.
        if (! $user = auth()->setRequest($request)->user()) {
            return $this->responseUnauthorized();
        }

        // User can only acccess their own data.
        if ($todo->user_id === $user->id) {
            return $this->responseUnauthorized();
        }

        $todo = Todo::where('id', $id)->firstOrFail();
        return new TodoResource($todo);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
        // Get user from $request token.
        if (! $user = auth()->setRequest($request)->user()) {
            return $this->responseUnauthorized();
        }

        // Validates data.
        $validator = Validator::make($request->all(), [
            'value' => 'string',
            'status' => 'in:closed,open',
        ]);

        if ($validator->fails()) {
            return $this->responseUnprocessable($validator->errors());
        }

        try {
            $todo = Todo::where('id', $id)->firstOrFail();
            if ($todo->user_id === $user->id) {
                if (request('value')) {
                    $todo->value = request('value');
                }
                if (request('status')) {
                    $todo->status = request('status');
                }
                $todo->save();
                return $this->responseResourceUpdated();
            } else {
                return $this->responseUnauthorized();
            }
        } catch (Exception $e) {
            return $this->responseServerError('Error updating resource.');
        }
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy(Request $request, $id)
    {
        
        $todo = Lead::where('id', $id)->firstOrFail();
        try {
            $todo->delete();
            return $this->responseResourceDeleted();
        } catch (Exception $e) {
            return $this->responseServerError('Error deleting resource.');
        }
    }

    public function status($id)
    {
        try{
            $lead=Lead::where('id', $id)->first();
            if($lead->status == '1'){
                $lead->status="0";
            }else if($lead->status == '0'){
                $lead->status="1";
            }
            $lead->save();
            return response()->json([
                'status' => 201,
                'message' => 'Lead successfully saved',
                'status' => 'success',
                'data' => $lead
            ], 201);;
        }catch(Exception $e){
            return response()->json([
                'status' => 500,
                'message' => 'Error',
            ], 201);;
        }
        
    }

}
