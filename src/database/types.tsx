export namespace DatabaseTypes {
  type Document = {
    _id?: string;
    createdAt?: Date;
    updatedAt?: Date;
    [key: string]: any;
  };

  export interface BoardItemProps {
    id: string;
    content: string;
    date: Date | string | number;
    description: string;
    [key: string]: any;
  }

  export interface BoardColumnProps {
    id: string;
    title: string;
    itemsIds: string[];
  }

  export interface DataRecord extends Document {
    items: {
      [key: string]: BoardItemProps;
    };
    columns: {
      [key: string]: BoardColumnProps;
    };
    columnsOrder: string[];
  }

  export interface Status {
    status: boolean;
  }

  export interface Calendar {
    id: number | string;
    start: Date;
    end: Date;
    title: string;
    allDay: boolean;
    boardId: string;
  }
}
