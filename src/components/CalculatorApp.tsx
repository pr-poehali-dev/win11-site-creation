import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

export default function CalculatorApp() {
  const [display, setDisplay] = useState('0');
  const [previousValue, setPreviousValue] = useState<number | null>(null);
  const [operation, setOperation] = useState<string | null>(null);

  const handleNumber = (num: string) => {
    if (display === '0') {
      setDisplay(num);
    } else {
      setDisplay(display + num);
    }
  };

  const handleOperation = (op: string) => {
    setPreviousValue(parseFloat(display));
    setOperation(op);
    setDisplay('0');
  };

  const calculate = () => {
    if (previousValue === null || operation === null) return;
    const current = parseFloat(display);
    let result = 0;

    switch (operation) {
      case '+':
        result = previousValue + current;
        break;
      case '-':
        result = previousValue - current;
        break;
      case '×':
        result = previousValue * current;
        break;
      case '÷':
        result = previousValue / current;
        break;
    }

    setDisplay(result.toString());
    setPreviousValue(null);
    setOperation(null);
  };

  const clear = () => {
    setDisplay('0');
    setPreviousValue(null);
    setOperation(null);
  };

  const buttonClass = "h-14 text-lg font-semibold hover:bg-accent";
  const operationClass = "h-14 text-lg font-semibold bg-primary/10 hover:bg-primary/20";

  return (
    <Card className="p-4 w-full h-full bg-background">
      <div className="mb-4 p-4 bg-muted rounded-lg text-right">
        <div className="text-3xl font-bold">{display}</div>
      </div>
      <div className="grid grid-cols-4 gap-2">
        <Button onClick={clear} variant="outline" className={operationClass}>C</Button>
        <Button onClick={() => handleOperation('÷')} variant="outline" className={operationClass}>÷</Button>
        <Button onClick={() => handleOperation('×')} variant="outline" className={operationClass}>×</Button>
        <Button onClick={() => setDisplay(display.slice(0, -1) || '0')} variant="outline" className={operationClass}>⌫</Button>

        <Button onClick={() => handleNumber('7')} variant="outline" className={buttonClass}>7</Button>
        <Button onClick={() => handleNumber('8')} variant="outline" className={buttonClass}>8</Button>
        <Button onClick={() => handleNumber('9')} variant="outline" className={buttonClass}>9</Button>
        <Button onClick={() => handleOperation('-')} variant="outline" className={operationClass}>−</Button>

        <Button onClick={() => handleNumber('4')} variant="outline" className={buttonClass}>4</Button>
        <Button onClick={() => handleNumber('5')} variant="outline" className={buttonClass}>5</Button>
        <Button onClick={() => handleNumber('6')} variant="outline" className={buttonClass}>6</Button>
        <Button onClick={() => handleOperation('+')} variant="outline" className={operationClass}>+</Button>

        <Button onClick={() => handleNumber('1')} variant="outline" className={buttonClass}>1</Button>
        <Button onClick={() => handleNumber('2')} variant="outline" className={buttonClass}>2</Button>
        <Button onClick={() => handleNumber('3')} variant="outline" className={buttonClass}>3</Button>
        <Button onClick={calculate} variant="default" className="row-span-2 h-full text-xl bg-primary hover:bg-primary/90">=</Button>

        <Button onClick={() => handleNumber('0')} variant="outline" className={`${buttonClass} col-span-2`}>0</Button>
        <Button onClick={() => handleNumber('.')} variant="outline" className={buttonClass}>.</Button>
      </div>
    </Card>
  );
}
