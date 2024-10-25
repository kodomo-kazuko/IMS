import api from "@/lib/axios/api";

export default class InternshipService {
  async getInternships() {
    const response = await api.get("/internship/all/base");
    const data = response.data;
    return data;
  }

  async getInternshipById(id: string) {
    const response = await api.get(`/internship/${id}`);
    const data = response.data;
    return data;
  }

  async createInternship(internship: any) {
    const response = await api.post("/internship/create", internship);
    const data = response.data;
    return data;
  }
  async getTypes() {
    const response = await api.get("/internship/types");
    const data = response.data;
    return data;
  }
}
