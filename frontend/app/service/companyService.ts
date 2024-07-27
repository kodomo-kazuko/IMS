import api from "@/api/api";

export default class CompanyService {
  async getCompanies() {
    const response = await api.get("/company/all/base");
    const data = response.data;
    return data;
  }

  async getCompanyById(id: string) {
    const response = await api.get(`/company/${id}`);
    const data = response.data;
    return data;
  }

  async createCompany(company: any) {
    const response = await api.post("/company/signup", company);
    const data = response.data;
    return data;
  }
  async signInCompany(company: any) {
    const response = await api.post("/company/signin", company);
    const data = response.data;
    return data;
  }
}
