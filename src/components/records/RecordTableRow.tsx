import { TableCell, TableRow } from "../ui/table";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Edit, CheckCircle, Trash2, MoreVertical } from "lucide-react";
import { Record } from "./RecordModal";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";

interface RecordTableRowProps {
  record: Record;
  onEdit: (record: Record) => void;
  onConfirm: (id: string) => void;
  onDelete: (id: string) => void;
  isMobile: boolean;
}

const categoryColors: Record<string, string> = {
  Alimentação: "bg-orange-100 text-orange-800 border-orange-200",
  Transporte: "bg-blue-100 text-blue-800 border-blue-200",
  Moradia: "bg-purple-100 text-purple-800 border-purple-200",
  Saúde: "bg-red-100 text-red-800 border-red-200",
  Educação: "bg-green-100 text-green-800 border-green-200",
  Lazer: "bg-pink-100 text-pink-800 border-pink-200",
  Salário: "bg-emerald-100 text-emerald-800 border-emerald-200",
  Investimentos: "bg-indigo-100 text-indigo-800 border-indigo-200",
  Outros: "bg-gray-100 text-gray-800 border-gray-200",
};

const statusLabels = {
  pending: "Pendente",
  paid: "Pago",
  cancelled: "Cancelado",
};

const statusColors = {
  pending: "bg-yellow-100 text-yellow-800 border-yellow-200",
  paid: "bg-green-100 text-green-800 border-green-200",
  cancelled: "bg-red-100 text-red-800 border-red-200",
};

export function RecordTableRow({ record, onEdit, onConfirm, onDelete, isMobile }: RecordTableRowProps) {
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr + "T00:00:00");
    return date.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" });
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  if (isMobile) {
    return (
      <div className="bg-white rounded-lg p-4 mb-3 shadow-sm border border-gray-200">
        <div className="flex justify-between items-start mb-2">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-gray-600">{formatDate(record.date)}</span>
              <Badge className={`${categoryColors[record.category] || categoryColors.Outros} rounded-full`}>
                {record.category}
              </Badge>
            </div>
            <h4 className="mb-1">{record.description}</h4>
            <div className="flex gap-2 items-center">
              <Badge
                className={`rounded-full ${
                  record.type === "income" ? "bg-green-100 text-green-800 border-green-200" : "bg-red-100 text-red-800 border-red-200"
                }`}
              >
                {record.type === "income" ? "Entrada" : "Saída"}
              </Badge>
              <Badge className={`${statusColors[record.status]} rounded-full`}>
                {statusLabels[record.status]}
              </Badge>
            </div>
          </div>
          <div className="flex flex-col items-end gap-2">
            <span className={`${record.type === "income" ? "text-green-600" : "text-red-600"}`}>
              {formatCurrency(record.value)}
            </span>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => onEdit(record)}>
                  <Edit className="h-4 w-4 mr-2" />
                  Editar
                </DropdownMenuItem>
                {record.status === "pending" && (
                  <DropdownMenuItem onClick={() => onConfirm(record.id)}>
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Confirmar
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem onClick={() => onDelete(record.id)} className="text-red-600">
                  <Trash2 className="h-4 w-4 mr-2" />
                  Excluir
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    );
  }

  return (
    <TableRow>
      <TableCell>{formatDate(record.date)}</TableCell>
      <TableCell>{record.description}</TableCell>
      <TableCell>
        <Badge className={`${categoryColors[record.category] || categoryColors.Outros} rounded-full`}>
          {record.category}
        </Badge>
      </TableCell>
      <TableCell>
        <Badge
          className={`rounded-full ${
            record.type === "income" ? "bg-green-100 text-green-800 border-green-200" : "bg-red-100 text-red-800 border-red-200"
          }`}
        >
          {record.type === "income" ? "Entrada" : "Saída"}
        </Badge>
      </TableCell>
      <TableCell className="text-right">
        <span className={record.type === "income" ? "text-green-600" : "text-red-600"}>
          {formatCurrency(record.value)}
        </span>
      </TableCell>
      <TableCell>
        <Badge className={`${statusColors[record.status]} rounded-full`}>
          {statusLabels[record.status]}
        </Badge>
      </TableCell>
      <TableCell>
        <div className="flex gap-1">
          <Button variant="ghost" size="sm" onClick={() => onEdit(record)}>
            <Edit className="h-4 w-4" />
          </Button>
          {record.status === "pending" && (
            <Button variant="ghost" size="sm" onClick={() => onConfirm(record.id)}>
              <CheckCircle className="h-4 w-4" />
            </Button>
          )}
          <Button variant="ghost" size="sm" onClick={() => onDelete(record.id)}>
            <Trash2 className="h-4 w-4 text-red-600" />
          </Button>
        </div>
      </TableCell>
    </TableRow>
  );
}
