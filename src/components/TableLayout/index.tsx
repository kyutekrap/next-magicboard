'use client';

import { useState } from 'react';
import { GlobalStrings, GlobalKeys } from '@/model';
import { KeyModel } from '@/model/types';
import { Button } from '../Button';
import { Paper } from '../Paper';
import { hide } from '@/common';
import { Paragraph } from '../Paragraph';
import { Input } from '../Input';

export const TableLayout = ({
  pageId,
  keys,
  setKeys
}: {
  pageId: string,
  keys: KeyModel[],
  setKeys: Function
}) => {
  const [columns, setColumns] = useState<KeyModel[]>(keys);

  function saveColumns() { 
    setKeys(columns);
    GlobalKeys.set(pageId, columns);
    hide();
  }

  const Columns = () => {
    const [dragSrcIndex, setDragSrcIndex] = useState<number | null>(null);

    const handleDragStart = (index: number) => {
      setDragSrcIndex(index);
    };

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
    };

    const handleDrop = (index: number) => {
      if (dragSrcIndex !== null) {
        const newItems = [...columns];
        const [movedItem] = newItems.splice(dragSrcIndex, 1);
        newItems.splice(index, 0, movedItem);
        setColumns(newItems);
      }
      setDragSrcIndex(null);
    };

    return (
      <div className='m-4 flex flex-col'>
        {columns.map((item, index) => (
          <div className='flex flex-row items-center justify-between'>
            <div className='flex-1 flex flex-row items-center space-x-2'>
              <div
              key={index}
              className="cursor-pointer"
              draggable
              onDragStart={() => handleDragStart(index)}
              onDragOver={handleDragOver}
              onDrop={() => handleDrop(index)}
              >
                <img src='/icons/hamburger.svg' width={20} height={20} className="dark:invert" />
              </div>
              <Paragraph>{item.name}</Paragraph>
            </div>
            <div>
              <Input.Checkbox
                checked={item.visibility}
                onChange={() => {
                  const updatedColumns = columns.map((column, i) => 
                      i === index ? { ...column, visibility: !column.visibility } : column
                  )
                  setColumns(updatedColumns)
                }}
              />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
      <div className='flex flex-col space-y-4 px-2 pt-2 pb-4'>
        <Paper>
          <Columns />
        </Paper>
        <Button variant='contained' onClick={() => saveColumns()}>
          {GlobalStrings.get("dashboard", "save")}
        </Button>
      </div>
  );
}