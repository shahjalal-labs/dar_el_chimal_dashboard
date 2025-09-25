/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React, { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Eye } from 'lucide-react';
import { Dialog, DialogTrigger } from '../ui/dialog';
import { usePathname } from 'next/navigation';
import { SyncLoader } from "react-spinners";
import { RiDeleteBin6Line } from 'react-icons/ri';
import { Button } from '../ui/button';
import { FaEdit } from 'react-icons/fa';
import ViewGroundModal from '../Playground/ViewGroundModal';
import AddGroundModal from '../Playground/AddGroundModal';
import UpdateGroundModal from '../Playground/UpdateGroundModal';
import { useDeleteGroundMutation } from '@/redux/api/playground/ground';
import { toast } from 'sonner';
import BookingModal from '../Playground/BookingModal';
import AddEventModal from '../Event/AddEventModal';
import ViewEventModal from '../Event/ViewEventModal';
import UpdateEventModal from '../Event/UpdateEventModal';
import ViewTeamsModal from '../Teams/ViewTeamsModal';
import CreateTeamModal from '../Teams/CreateTeamModal';
import ViewSingleTeamModal from '../Teams/ViewSingleTeamModal';
import UpdateTeamModal from '../Teams/UpdateTeamModal';
import ViewStoreModal from '../Store/ViewStoreModal';
import AddStoreModal from '../Store/AddStoreModal';
import UpdateStoreModal from '../Store/UpdateStoreModal';
import ViewProductModal from '../Product/ViewProductModal';
import AddProductModal from '../Product/AddProductModal';
import UpdateProductModal from '../Product/UpdateProductModal';
import AddParentCategory from '../ParentCategory/AddParentCategory';
import ViewParentCategory from '../ParentCategory/ViewParentCategory';
import UpdateParentCategory from '../ParentCategory/UpdateParentCategory';
import ViewProductCategory from '../ProductCategory/ViewProductCategory';
import AddProductCategory from '../ProductCategory/AddProductCategory';
import ViewSingleProductCategory from '../ProductCategory/ViewSingleProductCategory';
import UpdateProductCategory from '../ProductCategory/UpdateProductCategory';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '../ui/alert-dialog';
import { PiSpinner } from 'react-icons/pi';
import { useDeleteProductCategroyMutation } from '@/redux/api/ecommerce/productCategory';
import { useDeleteProductMutation } from '@/redux/api/ecommerce/product';
import { useDeleteStoreMutation } from '@/redux/api/ecommerce/store';
import { useDeleteParentCategroyMutation } from '@/redux/api/admin/parentCategory';
import ViewVendorDetailsModal from '../Admin/ViewVendorDetailsModal';


const DataTable = (
  {
    title,
    data,
    isButton,
    isButtonTwo,
    buttonText,
    buttonTextTwo,
    currentPage,
    sort,
    icon,
    iconTwo
  }: {
    title: string,
    data: any,
    isButton?: boolean,
    isButtonTwo?: boolean,
    buttonText?: string,
    buttonTextTwo?: string,
    currentPage?: number,
    sort?: React.ReactNode,
    icon?: React.ReactNode,
    iconTwo?: React.ReactNode
  }) => {
  const pathname = usePathname();
  const [selectedId, setSelectedId] = useState('');

  const [DeleteGround, { isLoading: isGroundDeleting }] = useDeleteGroundMutation();
  const [DeleteProductCategroy, { isLoading: isProductCategoryDeleting }] = useDeleteProductCategroyMutation();
  const [DeleteProduct, { isLoading: isProductDeleting }] = useDeleteProductMutation();
  const [DeleteStore, { isLoading: isStoreDeleting }] = useDeleteStoreMutation();
  const [DeleteParentCategroy, { isLoading: isParentCategroyDeleting }] = useDeleteParentCategroyMutation();

  const handleDelete = async (id: string) => {
    try {
      if (pathname === '/vendor/playground/ground-availability') {
        const response = await DeleteGround(id).unwrap();
        if (response.success) {
          toast.success(response.message)
        }
      }
      if (pathname === '/vendor/ecommerce/manage-product') {
        if (title === 'Manage Product Category') {
          const response = await DeleteProductCategroy(id).unwrap();
          if (response.success) {
            toast.success(response.message)
          }
        }
        else {
          const response = await DeleteProduct(id).unwrap();
          if (response.success) {
            toast.success(response.message)
          }
        }
      }
      if (pathname === '/vendor/ecommerce/manage-on-store') {
        const response = await DeleteStore(id).unwrap();
        if (response.success) {
          toast.success(response.message)
        }
      }
      if (pathname === '/admin/sports-category') {
        const response = await DeleteParentCategroy(id).unwrap();
        if (response.success) {
          toast.success(response.message)
        }
      }
    } catch (err) {
      toast.warning((err as any)?.data?.message || "Something went wrong");
    }
  }

  return (
    <div>
      <div className="md:flex justify-between items-center mb-6">
        {/* Left - Title */}
        <h1 className="text-xl md:text-2xl font-semibold">{title}</h1>

        {/* Right - Sort + Button */}
        <div className="md:flex items-center gap-3 ml-auto">
          <div className='mt-4 md:mt-0'>
            {sort}
          </div>
          {isButton && (
            <Dialog>
              <DialogTrigger asChild>
                <button
                  className="flex justify-center items-center rounded-lg gap-1 px-4 py-2 transition-colors ease-in-out duration-500 cursor-pointer bg-[#1E3A8A] hover:bg-[#1E3A8A80] text-white"
                >
                  {icon}
                  {buttonText}
                </button>
              </DialogTrigger>
              {
                pathname === '/vendor/event/manage-event' ?
                  <AddEventModal /> :
                  pathname === '/vendor/ecommerce/manage-on-store' ?
                    <AddStoreModal /> :
                    pathname === '/vendor/ecommerce/manage-product' ?
                      <AddProductModal /> :
                      pathname === '/admin/sports-category' ?
                        <AddParentCategory /> :
                        <AddGroundModal />
              }
            </Dialog>
          )}
          {isButtonTwo && (
            <Dialog>
              <DialogTrigger asChild>
                <button
                  className="flex justify-center items-center rounded-lg gap-1 px-4 py-2 transition-colors ease-in-out duration-500 cursor-pointer bg-[#1E3A8A] hover:bg-[#1E3A8A80] text-white mt-4 md:mt-0"
                >
                  {iconTwo}
                  {buttonTextTwo}
                </button>
              </DialogTrigger>
              {
                pathname === '/vendor/event/manage-event' ?
                  <>
                    {
                      buttonTextTwo === "Add Team" ?
                        <CreateTeamModal /> :
                        <ViewTeamsModal />
                    }
                  </> :
                  pathname === '/vendor/ecommerce/manage-product' ?
                    <>
                      {
                        buttonTextTwo === "Add Category" ?
                          <AddProductCategory /> :
                          <ViewProductCategory />
                      }
                    </> :
                    <></>
              }
            </Dialog>
          )}
        </div>
      </div>

      {
        !data ?
          <div className="flex justify-center items-center gap-4">
            <span className="text-[#1E3A8A]">Table Data is Loading</span>
            <SyncLoader color='#1E3A8A' />
          </div> :
          <Table className='bg-white'>
            <TableHeader>
              <TableRow className='bg-[#1E3A8A1A]'>
                <TableHead className="text-[#4A4A4A] font-semibold text-sm">SL</TableHead>
                {
                  data?.length > 0 &&
                  Object.keys(data[0])?.map((key, index) => (
                    <TableHead key={index} className="text-[#4A4A4A] font-semibold text-sm">
                      {
                        key !== 'Id' &&
                        key.split('_').map((header, idx) => (
                          <span key={idx}>{header} </span>
                        ))
                      }
                    </TableHead>
                  ))
                }
                {
                  (pathname !== '/' && pathname !== '/vendor/event/manage-booking' && pathname !== '/vendor/ecommerce/order-management' && pathname !== '/admin/manage-customers' && pathname !== '/admin/manage-order' && pathname !== '/admin/manage-transactions') && (
                    <TableHead className="text-[#4A4A4A] font-semibold text-sm">Action</TableHead>
                  )
                }
              </TableRow>
            </TableHeader>
            <TableBody>
              {
                data?.map((singleData: any, index: number) => (
                  <TableRow
                    key={index}
                    className="hover:bg-gray-50 text-[#5C5C5C]"
                  >
                    <TableCell className="text-sm">{(index + 1) + (((currentPage ?? 1) - 1) * 10)}</TableCell>
                    {
                      Object.entries(singleData).map(([key, value]: any, idx: number) => (
                        <TableCell key={idx} className="text-sm">
                          {
                            key === 'Id' ?
                              <></> : <span>{value}</span>
                          }
                        </TableCell>
                      ))
                    }
                    {
                      (pathname !== '/' && pathname !== '/vendor/event/manage-booking' && pathname !== '/vendor/ecommerce/order-management' && pathname !== '/admin/manage-customers' && pathname !== '/admin/manage-order' && pathname !== '/admin/manage-transactions') &&
                      (<TableCell className='flex items-center gap-2'>
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button onClick={() => setSelectedId(singleData?.Id)} className="bg-[#1E3A8A33] hover:bg-[#1E3A8A26] text-[#1E3A8A] transition-colors ease-in-out duration-200 cursor-pointer">
                              <span className="sr-only">View details</span>
                              <Eye className="h-6 w-6" />
                            </Button>
                          </DialogTrigger>
                          {
                            selectedId === singleData?.Id &&
                            <>
                              {
                                pathname === '/vendor/playground/playground-booking' ?
                                  <BookingModal id={singleData?.Id} /> :
                                  pathname === '/vendor/playground/ground-availability' ?
                                    <ViewGroundModal id={singleData?.Id} /> :
                                    pathname === '/vendor/event/manage-event' ?
                                      <>
                                        {
                                          buttonTextTwo === "Add Team" ?
                                            <ViewSingleTeamModal id={singleData?.Id} /> :
                                            <ViewEventModal id={singleData?.Id} />
                                        }
                                      </> :
                                      pathname === '/vendor/ecommerce/manage-on-store' ?
                                        <ViewStoreModal id={singleData?.Id} /> :
                                        pathname === '/vendor/ecommerce/manage-product' ?
                                          <>
                                            {
                                              buttonTextTwo === "Add Category" ?
                                                <ViewSingleProductCategory id={singleData?.Id} /> :
                                                <ViewProductModal id={singleData?.Id} />
                                            }
                                          </> :
                                          pathname === '/admin/sports-category' ?
                                            <ViewParentCategory id={singleData?.Id} /> :
                                            pathname === '/admin/manage-vendor' ?
                                              <ViewVendorDetailsModal id={singleData?.Id} /> :
                                              <></>
                              }
                            </>
                          }
                        </Dialog>
                        {
                          (pathname === '/vendor/playground/ground-availability' || pathname === '/vendor/event/manage-event' || pathname === '/vendor/ecommerce/manage-on-store' || pathname === '/vendor/ecommerce/manage-product' || pathname === '/admin/sports-category') &&
                          (<>
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button onClick={() => setSelectedId(singleData?.Id)} className="bg-[#0972DF33] hover:bg-[#0972DF26] text-[#0972DF] transition-colors ease-in-out duration-200 cursor-pointer">
                                  <span className="sr-only">Update</span>
                                  <FaEdit className="h-6 w-6" />
                                </Button>
                              </DialogTrigger>
                              {
                                selectedId === singleData?.Id &&
                                (
                                  pathname === '/vendor/playground/ground-availability' ?
                                    <UpdateGroundModal id={singleData?.Id} /> :
                                    pathname === '/vendor/event/manage-event' ?
                                      <>
                                        {
                                          buttonTextTwo === "Add Team" ?
                                            <UpdateTeamModal id={singleData?.Id} /> :
                                            <UpdateEventModal id={singleData?.Id} />
                                        }
                                      </> :
                                      pathname === '/vendor/ecommerce/manage-on-store' ?
                                        <UpdateStoreModal id={singleData?.Id} /> :
                                        pathname === '/vendor/ecommerce/manage-product' ?
                                          <>
                                            {
                                              buttonTextTwo === "Add Category" ?
                                                <UpdateProductCategory id={singleData?.Id} /> :
                                                <UpdateProductModal id={singleData?.Id} />
                                            }
                                          </> :
                                          pathname === '/admin/sports-category' ?
                                            <UpdateParentCategory id={singleData?.Id} /> :
                                            <></>
                                )
                              }
                            </Dialog>
                            {
                              pathname !== '/vendor/event/manage-event' &&
                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <Button
                                    className="bg-[#FE4D4F33] hover:bg-[#FE4D4F26] text-[#FE4D4F] transition-colors ease-in-out duration-200 cursor-pointer">
                                    <span className="sr-only">Delete</span>
                                    {
                                      ((isGroundDeleting || isProductCategoryDeleting || isProductDeleting || isStoreDeleting || isParentCategroyDeleting) && selectedId === singleData?.Id) ?
                                        <div className="animate-spin">
                                          <PiSpinner className="h-4 w-4" />
                                        </div> :
                                        <RiDeleteBin6Line className='w-6 h-6' />
                                    }
                                  </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                    <AlertDialogDescription>
                                      This action cannot be undone. This will permanently delete the {singleData.Name ?? 'item'}.
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction
                                      className="bg-red-600 text-white hover:bg-red-700"
                                      onClick={() => {
                                        setSelectedId(singleData?.Id)
                                        handleDelete(singleData?.Id)
                                      }}
                                    >
                                      Yes, Delete
                                    </AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                            }
                          </>)
                        }
                      </TableCell>)
                    }
                  </TableRow>
                ))
              }
            </TableBody>
          </Table>
      }
    </div>
  );
};

export default DataTable;