import React, { Fragment, useEffect, useState } from "react";
import { getOrderDetails, STATUSES, clearError as stopError } from "../../store/orderDetailsSlice";
import { useDispatch, useSelector } from "react-redux";
import MetaData from "../layout/MetaData";
import { Link } from "react-router-dom";
import { Typography } from "@material-ui/core";
import SideBar from "./Sidebar";
import Loader from "../layout/Loader/Loader";
import { useAlert } from "react-alert";
import AccountTreeIcon from "@material-ui/icons/AccountTree";
import { Button } from "@material-ui/core";
import { setIsUpdated, clearError,  UpdateOrder, STATUSES as updateStatus } from "../../store/deleteUpdateOrderSlice";
import './processOrder.css';

const ConfirmOrder = ({ history, match }) => {
  const dispatch = useDispatch();
  const alert = useAlert();
  const { order, status } = useSelector((state) => state.orderDetails);
  const { isUpdated } = useSelector((state) => state.deleteUpdateOrder);
  const [statuses ,setStatuses]=useState("")
  const error = STATUSES.ERROR;
  const updateError=updateStatus.ERROR;
  useEffect(() => {
    if (error !== "no-error") {
      alert.error(error);
      dispatch(stopError('no-error'));  
    }
    if(isUpdated){
        alert.success("Order Updated Successfully");
        dispatch(setIsUpdated(false))
    }
    if(updateError !=="no-error"){
        alert.error(updateError);
        dispatch(clearError('no-error'));  
    }

    dispatch(getOrderDetails(match.params.id));
  }, [dispatch, error, alert, match.params.id ,updateError, isUpdated]);

  const updateOrderSubmitHandler = (e) => {
    e.preventDefault();
    const myForm =new FormData();

    myForm.set("status", statuses);
    dispatch(UpdateOrder(match.params.id ,myForm))
  };
  return (
    <Fragment>
      <MetaData title="PROCESS ORDER" />

      <div className="dashboard">
        <SideBar />
        <div className="newProductContainer">
          {status === STATUSES.LOADING ? (
            <Loader />
          ) : (
            <div className="confirmOrderPage"
            style={{display:order.orderStatus === "Delivered" ? "block": "grid"}}
            >
              <div>
                <div className="confirmshippingArea">
                  <Typography>Shipping Info</Typography>
                  <div className="orderDetailsContainerBox">
                    <div>
                      <p>Name:</p>
                      <span>{order.user && order.user.name}</span>
                    </div>
                    <div>
                      <p>Phone:</p>
                      <span>
                        {order.shippingInfo && order.shippingInfo.phoneNo}
                      </span>
                    </div>
                    <div>
                      <p>Address:</p>
                      <span>
                        {order.shippingInfo &&
                          `${order.shippingInfo.address}, ${order.shippingInfo.city}, ${order.shippingInfo.state}, ${order.shippingInfo.pinCode}, ${order.shippingInfo.country}`}
                      </span>
                    </div>
                  </div>

                  <Typography>Payment</Typography>
                  <div className="orderDetailsContainerBox">
                    <div>
                      <p
                        className={
                          order.paymentInfo &&
                          order.paymentInfo.status === "succeeded"
                            ? "greenColor"
                            : "redColor"
                        }
                      >
                        {order.paymentInfo &&
                        order.paymentInfo.status === "succeeded"
                          ? "PAID"
                          : "NOT PAID"}
                      </p>
                    </div>
                    <div>
                      <p>Amount:</p>
                      <span>₹{order.totalPrice && order.totalPrice}</span>
                    </div>
                  </div>
                  <Typography>Order Status</Typography>
                  <div className="orderDetailsContainerBox">
                    <div>
                      <p
                        className={
                          order.orderStatus && order.orderStatus === "Delivered"
                            ? "greenColor"
                            : "redColor"
                        }
                      >
                        {order.orderStatus && order.orderStatus}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="confirmCartItems">
                  <Typography>Your Cart Items:</Typography>
                  <div
                    className="confirmCartItemsContainer"
                    style={{ marginLeft: 0 }}
                  >
                    {order.orderItems &&
                      order.orderItems.map((item) => (
                        <div key={item.product}>
                          <img src={item.image} alt="Product" />
                          <Link to={`/product/${item.product}`}>
                            {item.name}
                          </Link>{" "}
                          <span>
                            {item.quantity} X ₹{item.price} ={" "}
                            <b>₹{item.price * item.quantity}</b>
                          </span>
                        </div>
                      ))}
                  </div>
                </div>
              </div>
              {/* {} */}
              <div 
              style={{display:order.orderStatus === "Delivered" ? "none" : "block"}}
              >
                <form
                  className="updateOrderForm"
                  onSubmit={updateOrderSubmitHandler}
                >
                  <h1>Process Order</h1>
                  <div>
                    <AccountTreeIcon />
                    <select
                      value={statuses}
                      onChange={(e) => setStatuses(e.target.value)}
                    >
                      <option value="">Choose Category</option>
                      {order.orderStatus==="Processing" &&(<option value="Shipped">Shipped</option>)}
                      {order.orderStatus==="Shipped" && (<option value="Delivered">Delivered</option>)}
                    </select>
                  </div>
                
                  
            
                  <Button
                    id="createProductBtn"
                    type="submit"
                    disabled={status === STATUSES.LOADING ? true : false || statuses=== "" ? true : false} 
                  >
                    Process
                  </Button>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>
    </Fragment>
  );
};

export default ConfirmOrder;
