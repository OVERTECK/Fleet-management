using Backend.DataAccess.Entities;

namespace Backend.DataAccess.Repositories.Abstractions;

public interface IDriversRepository
{
    Task<List<DriverEntity>> GetAll();

    Task<DriverEntity> GetById(Guid id);

    Task Create(DriverEntity driver);

    Task Update(DriverEntity driver);

    Task Delete(Guid id);

    Task EnsureExists(Guid id);
}