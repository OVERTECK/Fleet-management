namespace Backend.DataAccess.Entities;

public class MaintenanceRecordEntity
{
    public Guid Id { get; set; }

    public CarEntity Car { get; set; }

    public string CarId { get; set; }

    public string TypeWork { get; set; }

    public Decimal Price { get; set; }
}