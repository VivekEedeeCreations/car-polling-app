"use client"
import Footer from '@/components/Footer/Footer'
import { Navbar } from '@/components/Navbar/Navbar'
import React, { useState, useEffect } from 'react'
import { useToast } from "@/hooks/use-toast";
import axios from 'axios'
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import CarGridSkeleton from '@/components/CarLoader/CarGridSkeleton';
import { PriceUpdate } from '@/components/Alert/PriceUpdate';
interface Car {
  id: string; 
  model: string;
  type: string;
  company: string;
  price: number;
  image: string;
  location: string;
  createdAt: string; 
  createdBy?: string; 
}

export default function page() {
  const { toast } = useToast();
  const [data, setData] = useState<Car[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const token = localStorage.getItem("token")
  const handleCarData = () =>{
    setData([]);
    axios.get("/api/car/update",{
      headers: {
        'Authorization': `Bearer ${token}`, // Add token to Authorization header
        'Content-Type': 'application/json', // Optional, if you want to specify content type
      },
    })
    .then((res)=>{
      setData((res.data as { data: Car[] }).data);
      setIsLoading(false);
    })
    .catch((err)=>{
      toast({
        variant:"destructive",
        description:(
          <p>{JSON.stringify(err)}</p>
        )
      })
    })
  }
  useEffect(() => {
    handleCarData();
  }, []);
  
  return (
    <>
    <Navbar/>
    {isLoading ? (
      <CarGridSkeleton/>
    ): (data.length > 0) &&(
      <div className='grid mt-6 mb-6 grid-cols-3 gap-4 grid-flow-row w-[80vw] place-content-center justify-self-center justify-center'>
      {data.map((car) => (
        <div key={car.id} className='grid h-[60vh] w-full border border-gray-800'>
          <img src={car.image} alt={car.model} className='h-[35vh] w-full' />
          <div className='grid'>
            <div className='grid grid-flow-row p-2 gap-1'>
              <div className='w-full flex justify-between'>
                <div>
                  <h1 className='font-sans font-bold'>{car.company} - {car.model}</h1>
                  <h1 className='font-sans font-bold'>{car.type}</h1>
                </div>
                <h1 className='font-sans font-bold'>₹{car.price}/<p className='text-gray-600'>per day</p></h1>
              </div>
              <Separator/>
                <h1 className='font-sans font-bold'>{car.location}</h1>
                <div className="w-full">
                  <PriceUpdate carId={car.id} currentPrice={car.price} onSuccess={handleCarData}/>
                </div>
            </div>
           
          </div>
        </div>
      ))}
      </div>
    )}
    <Footer/>
    </>
  )
}
