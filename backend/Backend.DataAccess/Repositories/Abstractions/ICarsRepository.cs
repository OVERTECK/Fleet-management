using Backend.DataAccess.Entities;

namespace Backend.DataAccess.Repositories.Abstractions;

public interface ICarsRepository
{
    Task<List<CarEntity>> GetAll();

    Task<CarEntity?> GetByVIN(string vin);

    Task Create(CarEntity car);

    Task<CarEntity> Update(CarEntity car);

    Task Delete(string vin);

    Task<bool> IsExists(string id);
}