import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "../ui/dialog";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";

export interface Record {
  id: string;
  date: string;
  description: string;
  category: string;
  type: "income" | "expense";
  value: number;
  status: "pending" | "paid" | "cancelled";
}

interface RecordModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (record: Omit<Record, "id"> | Record) => void;
  record?: Record;
}

const categories = [
  "Alimentação",
  "Transporte",
  "Moradia",
  "Saúde",
  "Educação",
  "Lazer",
  "Salário",
  "Investimentos",
  "Outros",
];

export function RecordModal({ open, onClose, onSave, record }: RecordModalProps) {
  const [date, setDate] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [type, setType] = useState<"income" | "expense">("expense");
  const [value, setValue] = useState("");
  const [status, setStatus] = useState<"pending" | "paid" | "cancelled">("pending");

  useEffect(() => {
    if (record) {
      setDate(record.date);
      setDescription(record.description);
      setCategory(record.category);
      setType(record.type);
      setValue(record.value.toString());
      setStatus(record.status);
    } else {
      setDate("");
      setDescription("");
      setCategory("");
      setType("expense");
      setValue("");
      setStatus("pending");
    }
  }, [record, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const recordData = {
      ...(record && { id: record.id }),
      date,
      description,
      category,
      type,
      value: parseFloat(value),
      status,
    };
    onSave(recordData as any);
    onClose();
  };

  const formatCurrency = (val: string) => {
    const numbers = val.replace(/\D/g, "");
    const amount = parseFloat(numbers) / 100;
    return amount.toFixed(2);
  };

  const handleValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCurrency(e.target.value);
    setValue(formatted);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[560px] backdrop-blur-sm bg-[#FFFFFFCC] border-[#FFFFFF33] rounded-2xl">
        <DialogHeader>
          <DialogTitle>{record ? "Editar registro" : "Novo registro"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="date">Data</Label>
              <Input
                id="date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
                className="rounded-lg bg-white"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Descrição</Label>
              <Input
                id="description"
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
                className="rounded-lg bg-white"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="category">Categoria</Label>
              <Select value={category} onValueChange={setCategory} required>
                <SelectTrigger className="rounded-lg bg-white">
                  <SelectValue placeholder="Selecione uma categoria" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Tipo</Label>
              <RadioGroup value={type} onValueChange={(val) => setType(val as "income" | "expense")}>
                <div className="flex gap-4">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="expense" id="expense" />
                    <Label htmlFor="expense">Saída</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="income" id="income" />
                    <Label htmlFor="income">Entrada</Label>
                  </div>
                </div>
              </RadioGroup>
            </div>
            <div className="space-y-2">
              <Label htmlFor="value">Valor</Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2">R$</span>
                <Input
                  id="value"
                  type="text"
                  value={value}
                  onChange={handleValueChange}
                  required
                  className="pl-10 rounded-lg bg-white"
                  placeholder="0,00"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select value={status} onValueChange={(val) => setStatus(val as any)}>
                <SelectTrigger className="rounded-lg bg-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">Pendente</SelectItem>
                  <SelectItem value="paid">Pago</SelectItem>
                  <SelectItem value="cancelled">Cancelado</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="ghost" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit" className="bg-[#3B82F6] hover:bg-[#2563EB]">
              Salvar
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
