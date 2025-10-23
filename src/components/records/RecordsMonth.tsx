import { useState, useEffect } from "react";
import { Button } from "../ui/button";
import { ChevronLeft, ChevronRight, Plus } from "lucide-react";
import { RecordModal, Record } from "./RecordModal";
import { RecordTableRow } from "./RecordTableRow";
import { Table, TableBody, TableHead, TableHeader, TableRow } from "../ui/table";
import { Skeleton } from "../ui/skeleton";
import { toast } from "sonner";
import { Badge } from "../ui/badge";

interface RecordsMonthProps {
  onLogout: () => void;
  userName?: string;
}

export function RecordsMonth({ onLogout, userName = "Usuário" }: RecordsMonthProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [records, setRecords] = useState<Record[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState<Record | undefined>();
  const [isLoading, setIsLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    loadRecords();
  }, [currentDate]);

  const loadRecords = async () => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      const mockRecords: Record[] = [
        {
          id: "1",
          date: "2025-10-05",
          description: "Supermercado",
          category: "Alimentação",
          type: "expense",
          value: 350.50,
          status: "paid",
        },
        {
          id: "2",
          date: "2025-10-10",
          description: "Salário Mensal",
          category: "Salário",
          type: "income",
          value: 5000.00,
          status: "paid",
        },
        {
          id: "3",
          date: "2025-10-15",
          description: "Conta de Luz",
          category: "Moradia",
          type: "expense",
          value: 180.00,
          status: "pending",
        },
        {
          id: "4",
          date: "2025-10-18",
          description: "Uber",
          category: "Transporte",
          type: "expense",
          value: 45.00,
          status: "paid",
        },
        {
          id: "5",
          date: "2025-10-20",
          description: "Academia",
          category: "Saúde",
          type: "expense",
          value: 120.00,
          status: "pending",
        },
      ];

      const filtered = mockRecords.filter((r) => {
        const recordDate = new Date(r.date + "T00:00:00");
        return (
          recordDate.getMonth() === currentDate.getMonth() &&
          recordDate.getFullYear() === currentDate.getFullYear()
        );
      });

      const sorted = filtered.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
      setRecords(sorted);
      setIsLoading(false);
    }, 500);
  };

  const handlePreviousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
  };

  const handleAddRecord = () => {
    setEditingRecord(undefined);
    setIsModalOpen(true);
  };

  const handleEditRecord = (record: Record) => {
    setEditingRecord(record);
    setIsModalOpen(true);
  };

  const handleSaveRecord = (record: Omit<Record, "id"> | Record) => {
    if ("id" in record) {
      // Edit
      setRecords((prev) => prev.map((r) => (r.id === record.id ? record : r)));
      toast.success("Registro atualizado com sucesso!");
    } else {
      // Add
      const newRecord = { ...record, id: Date.now().toString() } as Record;
      setRecords((prev) => [...prev, newRecord].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()));
      toast.success("Registro adicionado com sucesso!");
    }
  };

  const handleConfirmRecord = (id: string) => {
    setRecords((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: "paid" as const } : r))
    );
    toast.success("Registro confirmado!");
  };

  const handleDeleteRecord = (id: string) => {
    setRecords((prev) => prev.filter((r) => r.id !== id));
    toast.success("Registro excluído!");
  };

  const monthYear = currentDate.toLocaleDateString("pt-BR", {
    month: "long",
    year: "numeric",
  });

  const totalMonth = records.reduce(
    (acc, r) => acc + (r.type === "income" ? r.value : -r.value),
    0
  );

  const pendingCount = records.filter((r) => r.status === "pending").length;
  const paidCount = records.filter((r) => r.status === "paid").length;

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-7xl mx-auto">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-white text-center">Bem Vindo, {userName}</h1>
        </div>

        <div className="backdrop-blur-sm bg-[#FFFFFFCC] border-[#FFFFFF33] shadow-lg rounded-2xl p-6 mb-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
            <div className="flex items-center gap-4">
              <Button variant="outline" size="icon" onClick={handlePreviousMonth} className="rounded-lg">
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <h2 className="capitalize">{monthYear}</h2>
              <Button variant="outline" size="icon" onClick={handleNextMonth} className="rounded-lg">
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-2 items-center">
              <Badge variant="outline" className="rounded-lg">
                Total: {new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(totalMonth)}
              </Badge>
              <Badge variant="outline" className="rounded-lg bg-yellow-50">
                Pendentes: {pendingCount}
              </Badge>
              <Badge variant="outline" className="rounded-lg bg-green-50">
                Pagos: {paidCount}
              </Badge>
              <Button onClick={handleAddRecord} className="bg-[#3B82F6] hover:bg-[#2563EB] rounded-lg">
                <Plus className="h-4 w-4 mr-2" />
                Adicionar registro
              </Button>
            </div>
          </div>

          {isLoading ? (
            <div className="space-y-3">
              {[...Array(5)].map((_, i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          ) : records.length === 0 ? (
            <div className="text-center py-12">
              <div className="mb-4">
                <svg
                  className="mx-auto h-24 w-24 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              </div>
              <h3 className="mb-2 text-gray-900">Sem lançamentos neste mês</h3>
              <p className="text-gray-600 mb-6">Adicione seu primeiro registro financeiro</p>
              <Button onClick={handleAddRecord} className="bg-[#3B82F6] hover:bg-[#2563EB]">
                <Plus className="h-4 w-4 mr-2" />
                Adicionar registro
              </Button>
            </div>
          ) : isMobile ? (
            <div>
              {records.map((record) => (
                <RecordTableRow
                  key={record.id}
                  record={record}
                  onEdit={handleEditRecord}
                  onConfirm={handleConfirmRecord}
                  onDelete={handleDeleteRecord}
                  isMobile={true}
                />
              ))}
            </div>
          ) : (
            <div className="rounded-lg overflow-hidden border border-gray-200">
              <Table>
                <TableHeader className="bg-gray-50 sticky top-0">
                  <TableRow>
                    <TableHead>Data</TableHead>
                    <TableHead>Descrição</TableHead>
                    <TableHead>Categoria</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead className="text-right">Valor</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {records.map((record, index) => (
                    <RecordTableRow
                      key={record.id}
                      record={record}
                      onEdit={handleEditRecord}
                      onConfirm={handleConfirmRecord}
                      onDelete={handleDeleteRecord}
                      isMobile={false}
                    />
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </div>
      </div>

      <RecordModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveRecord}
        record={editingRecord}
      />
    </div>
  );
}
