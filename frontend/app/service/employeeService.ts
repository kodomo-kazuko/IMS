import api from "@/api/api";

export default class EmployeeService {
  async getEmployees() {
    const response = await api.get("/employee/all");
    const data = response.data;
    return data;
  }

  async getEmployeeById(id: string) {
    const response = await api.get(`/employee/${id}`);
    const data = response.data;
    return data;
  }

  async createEmployee(employee: any) {
    const response = await api.post("/employee/signup", employee);
    const data = response.data;
    return data;
  }
  async signInEmployee(employee: any) {
    const response = await api.post("/employee/signin", employee);
    const data = response.data;
    return data;
  }
}
