import React from "react";
import { Stepper } from "react-form-stepper";

const CustomStepper = (props) => {
    return (
      <Stepper
        { ...props }
        connectorStateColors={true}
        connectorStyleConfig={{
          completedColor: '#ffbd13',
          activeColor: '#ffbd13',
          disabledColor: '#eee',
        }}
        styleConfig={{
          activeBgColor: '#ffa500',
          completedBgColor: '#008000',
          inactiveBgColor: '#ADADAD',
          activeTextColor: '#fff',
          completedTextColor: '#ffa500',
          inactiveTextColor: '#444',
          fontWeight:'900',
          labelFontSize:'.75rem',
        }}
        />
    );
};

export default CustomStepper;