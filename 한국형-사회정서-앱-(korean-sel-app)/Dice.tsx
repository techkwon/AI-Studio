import React from 'react';

interface DiceProps {
  values: [number | null, number | null];
  isRolling: boolean;
}

const Dice: React.FC<DiceProps> = ({ values, isRolling }) => {
    
    const renderPips = (val: number | null) => {
        if (!val) return null;

        const pip = <div className="bg-gray-800 rounded-full w-3 h-3 md:w-4 md:h-4" />;

        switch(val) {
            case 1: 
                return <div className="col-start-2 row-start-2 flex items-center justify-center">{pip}</div>;
            case 2: 
                return <>
                    <div className="col-start-1 row-start-1 flex items-center justify-center">{pip}</div>
                    <div className="col-start-3 row-start-3 flex items-center justify-center">{pip}</div>
                </>;
            case 3: 
                return <>
                    <div className="col-start-1 row-start-1 flex items-center justify-center">{pip}</div>
                    <div className="col-start-2 row-start-2 flex items-center justify-center">{pip}</div>
                    <div className="col-start-3 row-start-3 flex items-center justify-center">{pip}</div>
                </>;
            case 4: 
                return <>
                    <div className="col-start-1 row-start-1 flex items-center justify-center">{pip}</div>
                    <div className="col-start-3 row-start-1 flex items-center justify-center">{pip}</div>
                    <div className="col-start-1 row-start-3 flex items-center justify-center">{pip}</div>
                    <div className="col-start-3 row-start-3 flex items-center justify-center">{pip}</div>
                </>;
            case 5: 
                return <>
                    <div className="col-start-1 row-start-1 flex items-center justify-center">{pip}</div>
                    <div className="col-start-3 row-start-1 flex items-center justify-center">{pip}</div>
                    <div className="col-start-2 row-start-2 flex items-center justify-center">{pip}</div>
                    <div className="col-start-1 row-start-3 flex items-center justify-center">{pip}</div>
                    <div className="col-start-3 row-start-3 flex items-center justify-center">{pip}</div>
                </>;
            case 6: 
                return <>
                    <div className="col-start-1 row-start-1 flex items-center justify-center">{pip}</div>
                    <div className="col-start-3 row-start-1 flex items-center justify-center">{pip}</div>
                    <div className="col-start-1 row-start-2 flex items-center justify-center">{pip}</div>
                    <div className="col-start-3 row-start-2 flex items-center justify-center">{pip}</div>
                    <div className="col-start-1 row-start-3 flex items-center justify-center">{pip}</div>
                    <div className="col-start-3 row-start-3 flex items-center justify-center">{pip}</div>
                </>;
            default: return null;
        }
    }

    const Die = ({ value }: { value: number | null }) => (
      <div className={`w-16 h-16 md:w-20 md:h-20 bg-white rounded-2xl shadow-lg flex items-center justify-center p-2 transition-transform duration-300 ${isRolling ? 'animate-spin' : ''}`}>
        <div className="w-full h-full grid grid-cols-3 grid-rows-3 p-1">
          {renderPips(value)}
        </div>
      </div>
    );

    return (
        <div className="flex gap-4">
            <Die value={values[0]} />
            <Die value={values[1]} />
        </div>
    )
};

export default Dice;
