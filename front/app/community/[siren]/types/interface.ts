export type YearOption = number | 'All';

export type TreeLeaf = {
  type: 'leaf';
  id: string;
  name: string;
  value: number;
  part:number
};

export type TreeNode = {
  type: 'node';
  id: string;
  name: string;
  value: number;
  children: TreeData[];
};

export type TreeData = TreeNode | TreeLeaf;   

export type TooltipProps = {
  visible?: boolean;
  x: number;
  y: number;
  name: string;
  value: number;
  percentage: number,
};
