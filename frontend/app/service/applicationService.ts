import api from "@/api/api";
import prisma from "@/prisma/prisma";

export default class ApplicationService {
  async getApplications(status?: string, id?: string) {
    const response = await api.get("/application/all/base", {
      params: {
        studentId: id,
        status: status,
      },
    });
    const data = response.data.data;
    return data;
  }

  async getApplicationById(id: string) {
    const response = await api.get(`/application/${id}`);
    const data = response.data;
    return data;
  }

  async createApplication(application: prisma.Application) {
    const response = await api.post("/application/create", application);
    const data = response.data;
    return data;
  }
}
