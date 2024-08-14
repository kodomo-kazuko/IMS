import api from "@/lib/axios/api";

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
    console.log(company);
    const response = await api.post("/company/signin", {email:company.email, password:company.password});
    
    const data = response.data;
    return data;
  }
}
